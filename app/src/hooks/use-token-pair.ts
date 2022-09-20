import type { Provider, Program } from "@project-serum/anchor";
import swr from "swr";
// eslint-disable-next-line import/no-extraneous-dependencies
import { account } from "@twamm/client.js";

import { useProgram } from "./use-program";

const fetcher = (
  getProvider: Promise<Provider>,
  getProgram: Promise<Program>
) => {
  const data = account.getEncodedDiscriminator("TokenPair");

  return async () => {
    const provider = await getProvider;
    const program = await getProgram;

    const pairs = await provider.connection.getProgramAccounts(
      program.programId,
      {
        filters: [{ dataSize: 592 }, { memcmp: { bytes: data, offset: 0 } }],
      }
    );

    const fetchPair = (pair: any) =>
      program.account.tokenPair.fetch(pair.pubkey);

    const pairsData = await Promise.all(pairs.map(fetchPair));

    return pairsData;
  };
};

export const useTokenPair = () => {
  const { program, provider } = useProgram();

  return swr("TokenPair", fetcher(provider, program), {});
};
