import type { Provider, Program } from "@project-serum/anchor";
import swr from "swr";
import { account } from "@twamm/client.js";

import { dedupeEach, revalOnFocus } from "../utils/api";
import { useProgram } from "./use-program";

const fetcher = (provider: Provider, program: Program) => {
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

    const pairsData = await Promise.all(pairs.map(fetchPair));

    return pairsData;
  };
};

export const useTokenPairs = () => {
  const { program, provider } = useProgram();

  const opts = { ...dedupeEach(2e3), ...revalOnFocus() };

  return swr("TokenPairs", fetcher(provider, program), opts);
};
