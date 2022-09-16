import swr from "swr";
import { account } from "@twamm/client.js";

import { useProgram } from "./use-program";

const fetcher = (getProvider, getProgram) => {
  const data = account.getEncodedDiscriminator("TokenPair");

  return async () => {
    const provider = await getProvider;
    const program = await getProgram;

    const data = account.getEncodedDiscriminator("TokenPair");

    const pairs = await provider.connection.getProgramAccounts(
      program.programId,
      {
        filters: [{ dataSize: 576 }, { memcmp: { bytes: data, offset: 0 } }],
      }
    );

    const fetchPair = (pair) => program.account.tokenPair.fetch(pair.pubkey);

    return Promise.all(pairs.map(fetchPair));
  };
};

export const useTokenPairs = () => {
  const { program, provider } = useProgram();

  return swr("TokenPair", fetcher(provider, program), {});
};
