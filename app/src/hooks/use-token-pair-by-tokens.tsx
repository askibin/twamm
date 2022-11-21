import type { Program } from "@project-serum/anchor";
import useSWR from "swr";

import useProgram from "./use-program";
import { resolveExchangePair } from "../utils/tokenpair-twamm-client";

const swrKey = (params: { aToken: TokenInfo; bToken: TokenInfo }) => ({
  key: "tokenPairByTokens",
  params,
});

type Params = Parameters<typeof swrKey>[0];

const fetcher = (program: Program) => {
  const resolvePair = resolveExchangePair(program);

  return async ({ params }: ReturnType<typeof swrKey>) => {
    const { aToken, bToken } = params;
    const { tokenPairData, exchangePair } = await resolvePair([aToken, bToken]);

    const { currentPoolPresent, futurePoolPresent, poolCounters, tifs } =
      tokenPairData;

    const pair = {
      currentPoolPresent,
      futurePoolPresent,
      poolCounters,
      tifs,
      exchangePair,
    };

    return pair;
  };
};

export default (params?: Params, options = {}) => {
  const { program } = useProgram();

  return useSWR(params && swrKey(params), fetcher(program), options);
};
