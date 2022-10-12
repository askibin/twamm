import type { Provider, Program } from "@project-serum/anchor";
import swr from "swr";
import { account } from "@twamm/client.js";

import type { APIHook } from "../utils/api";
import { dedupeEach, revalOnFocus } from "../utils/api";
import { useProgram } from "./use-program";

const swrKey = () => ({ key: "tokenPairs" });

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

    const pairsData: unknown = await Promise.all(pairs.map(fetchPair));

    return pairsData as TokenPairProgramData[];
  };
};

export const useTokenPairs: APIHook<void, TokenPairProgramData[]> = (
  _,
  options = {}
) => {
  const { program, provider } = useProgram();

  const opts = { ...dedupeEach(20e3), ...revalOnFocus(), ...options };

  return swr(swrKey(), fetcher(provider, program), opts);
};
