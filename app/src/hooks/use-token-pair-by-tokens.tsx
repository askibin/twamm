import type { Program } from "@project-serum/anchor";
import useSWR from "swr";

import useProgram from "./use-program";
import { resolveExchangePair } from "../utils/tokenpair-twamm-client";

const swrKey = (params: { aToken: TokenInfo; bToken: TokenInfo }) => ({
  key: "tokenPairByTokens",
  params,
});

const fetcher = (program: Program) => {
  const resolvePair = resolveExchangePair(program);

  return async ({ params }: SWRParams<typeof swrKey>) => {
    const { aToken, bToken } = params;
    const { tokenPairData, exchangePair } = await resolvePair([aToken, bToken]);

    const {
      configA,
      configB,
      currentPoolPresent,
      futurePoolPresent,
      poolCounters,
      statsA,
      statsB,
      tifs,
    } = tokenPairData;

    const pair = {
      configA,
      configB,
      currentPoolPresent,
      exchangePair,
      futurePoolPresent,
      poolCounters,
      statsA,
      statsB,
      tifs,
    };

    return pair;
  };
};

export default (params?: SWRArgs<typeof swrKey>, options = {}) => {
  const { program } = useProgram();

  return useSWR(params && swrKey(params), fetcher(program), options);
};
