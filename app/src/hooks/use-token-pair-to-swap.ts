import type { Provider, Program } from "@project-serum/anchor";
import swr from "swr";

import type { APIHook } from "../utils/api";
import { dedupeEach, refreshEach } from "../utils/api";
import { useProgram } from "./use-program";
import { resolveExchangePair } from "../utils/tokenpair-twamm-client";

const swrKey = (params: { aToken: JupToken; bToken: JupToken }) => ({
  key: "tokenPairToSwap",
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

export const useTokenPair: APIHook<Params, TokenPairData> = (
  params,
  options = {}
) => {
  const { provider, program } = useProgram();

  const opts = { ...dedupeEach(30e3), ...refreshEach(), ...options };
  // Should continiously update the pair to fetch actual data

  return swr(params && swrKey(params), fetcher(provider, program), opts);
};
