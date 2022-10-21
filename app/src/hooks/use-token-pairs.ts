import type { Provider, Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { account } from "@twamm/client.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { useProgram } from "./use-program";

const swrKey = (params: { address: PublicKey }) => ({
  key: "tokenPairs",
  params,
});

const fetcher = <T>(provider: Provider, program: Program) => {
  const data = account.getEncodedDiscriminator("TokenPair");

  return async () => {
    const pairs = await provider.connection.getProgramAccounts(
      program.programId,
      {
        filters: [{ dataSize: 592 }, { memcmp: { bytes: data, offset: 0 } }],
      }
    );

    const fetchPair = (pair: any) =>
      program.account.tokenPair.fetch(pair.pubkey);

    const pairsData: unknown = await Promise.all(pairs.map(fetchPair));

    return pairsData as T;
  };
};

export const useTokenPairs = (_: void, options = {}) => {
  const { program, provider } = useProgram();
  const { publicKey: address } = useWallet();

  return useSWR(
    address && swrKey({ address }),
    fetcher<TokenPairProgramData[]>(provider, program),
    options
  );
};
