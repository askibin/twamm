import type { Provider } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { SplToken } from "@twamm/client.js/lib/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import useProgram from "./use-program";

const swrKey = (params: { address: PublicKey }) => ({
  key: "account-tokens",
  params,
});

const fetcher =
  ({ provider }: { provider: Provider }) =>
  async ({ params }: SWRParams<typeof swrKey>) => {
    const data = (await provider.connection.getParsedProgramAccounts(
      SplToken.getProgramId(),
      {
        filters: [
          { dataSize: 165 },
          {
            memcmp: {
              offset: 32,
              bytes: params.address.toBase58(),
            },
          },
        ],
      }
    )) as AccountBalance[];

    return data;
  };

export default (_: void, options = {}) => {
  const { publicKey: address } = useWallet();
  const { provider } = useProgram();

  return useSWR(address && swrKey({ address }), fetcher({ provider }), options);
};
