import type { Provider, Program } from "@project-serum/anchor";
import useSWR from "swr";

import { useProgram } from "./use-program";
import { resolveExchangePair } from "../utils/tokenpair-twamm-client";

const swrKey = (params: { aToken: TokenInfo; bToken: TokenInfo }) => ({
  key: "tokenPair",
  params,
});

type Params = Parameters<typeof swrKey>[0];

const fetcher = (provider: Provider, program: Program) => {
  const resolvePair = resolveExchangePair(provider, program);

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

export const useTokenPair = (params?: Params, options = {}) => {
  const { provider, program } = useProgram();

  return useSWR(params && swrKey(params), fetcher(provider, program), options);
};
