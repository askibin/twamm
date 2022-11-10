import type { Provider, Program } from "@project-serum/anchor";
import useSWR from "swr";
import { account } from "@twamm/client.js";

import useProgram from "./use-program";

const swrKey = (params: {}) => ({
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

export default (_: void, options = {}) => {
  const { program, provider } = useProgram();

  return useSWR(
    swrKey({}),
    fetcher<TokenPairProgramData[]>(provider, program),
    options
  );
};
