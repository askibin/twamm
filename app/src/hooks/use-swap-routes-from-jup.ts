import type { DefaultApi, InlineResponse200Data } from "@jup-ag/api";
import M, { Extra } from "easy-maybe/lib";
import useSWR from "swr";
import { forit } from "a-wait-forit";
import { useWallet } from "@solana/wallet-adapter-react";
import useJupiterContext from "../contexts/jupiter-connection-context";
import useTxContext from "../contexts/transaction-runner-context";

export interface Route extends InlineResponse200Data {}

const swrKey = (params: {
  amount: number;
  decimals: number;
  inputMint: string;
  outputMint: string;
  slippage: number;
  userPublicKey: string;
}) => ({
  key: "jupiterSwapRoutes",
  params,
});

const convertPercentage = (a: number) => (a === 0 ? 0 : a * 100);
// 0.5% = 50

const fetcher =
  (api: DefaultApi) =>
  async ({ params }: SWRParams<typeof swrKey>) => {
    const routesData = await forit(
      api.v3QuoteGet({
        amount: String(params.amount * 10 ** params.decimals),
        inputMint: params.inputMint,
        outputMint: params.outputMint,
        slippageBps: convertPercentage(params.slippage),
        onlyDirectRoutes: true,
        userPublicKey: params.userPublicKey,
      })
    );

    const [err, routes] = routesData;

    if (err) {
      throw new Error("Can not load routes for the exchange. Try again later");
    }

    if (!routes.data || routes.data.length === 0)
      throw new Error(
        "Can not fetch best route for the order. Try again later"
      );

    return { best: routes.data[0] as Route, routes: routes.data as Route[] };
  };

export default (
  params: Voidable<
    Pick<
      SWRArgs<typeof swrKey>,
      "amount" | "decimals" | "inputMint" | "outputMint"
    >
  >,
  options = {}
) => {
  const { publicKey } = useWallet();
  const { ready, api } = useJupiterContext();
  const { slippage } = useTxContext();

  const data = M.andMap(
    ([p, s]) => ({ ...p, slippage: s }),
    Extra.combine2([M.of(params), M.of(slippage)])
  );

  return useSWR(
    M.withDefault(
      undefined,
      M.andMap(
        ([a, b]) => swrKey({ ...a, userPublicKey: b.toBase58() }),
        Extra.combine3([data, M.of(publicKey), M.of(ready)])
      )
    ),
    fetcher(api),
    options
  );
};
