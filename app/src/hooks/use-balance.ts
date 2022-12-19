import type { Provider } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import M, { Extra } from "easy-maybe/lib";
import useSWR from "swr";
import { SplToken } from "@twamm/client.js/lib/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import useAccountTokens, { AccountBalance } from "./use-account-tokens";
import useProgram from "./use-program";

type Params = { address: PublicKey; balances: AccountBalance[]; mint: string };

const swrKey = (params: Params) => ({
  key: "balance",
  params,
});

const fetcher =
  ({ provider }: { provider: Provider }) =>
  async (swr: FetcherArgs<Params>) => {
    if (SplToken.isNativeAddress(swr.params.mint)) {
      const data: number = await provider.connection.getBalance(
        swr.params.address
      );

      return Number((data * 1e-9).toFixed(String(data).length));
    }

    const accounts = swr.params.balances.map((d) => d.account.data.parsed.info);
    const targetInfo = accounts.find((a) => a.mint === swr.params.mint);

    if (!targetInfo) return 0;

    return targetInfo.tokenAmount.uiAmount;
  };

export default (mint: Voidable<string>, options = {}) => {
  const { publicKey: address } = useWallet();
  const { provider } = useProgram();

  const accountTokens = useAccountTokens();

  return useSWR(
    M.withDefault(
      undefined,
      M.andMap(
        (a) => swrKey({ address: a[0], balances: a[1], mint: a[2] }),
        Extra.combine3([M.of(address), M.of(accountTokens.data), M.of(mint)])
      )
    ),
    fetcher({ provider }),
    options
  );
};
