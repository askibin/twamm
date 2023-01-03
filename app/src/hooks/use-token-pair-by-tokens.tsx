import type { Program } from "@project-serum/anchor";
import useSWR from "swr";
import { OrderSide } from "@twamm/types/lib";

import useProgram from "./use-program";
import { resolveExchangePair } from "../domain/index";

const swrKey = (params: { aToken: TokenInfo; bToken: TokenInfo }) => ({
  key: "tokenPairByTokens",
  params,
});

const fetcher = (program: Program) => {
  const resolvePair = resolveExchangePair(program);

  return async ({ params }: SWRParams<typeof swrKey>) => {
    const { tokenPairData, exchangePair } = (await resolvePair([
      params.aToken,
      params.bToken,
    ])) as {
      tokenPairData: TokenPairProgramData;
      exchangePair: [[TokenInfo, TokenInfo], OrderSide];
    };

    const {
      allowDeposits,
      allowWithdrawals,
      configA,
      configB,
      currentPoolPresent,
      futurePoolPresent,
      maxSwapPriceDiff,
      maxUnsettledAmount,
      minTimeTillExpiration,
      poolCounters,
      statsA,
      statsB,
      tifs,
    } = tokenPairData;

    return {
      allowDeposits,
      allowWithdrawals,
      configA,
      configB,
      currentPoolPresent,
      exchangePair,
      futurePoolPresent,
      maxSwapPriceDiff,
      maxUnsettledAmount,
      minTimeTillExpiration,
      poolCounters,
      statsA,
      statsB,
      tifs,
    };
  };
};

export default (params?: SWRArgs<typeof swrKey>, options = {}) => {
  const { program } = useProgram();

  return useSWR(params && swrKey(params), fetcher(program), options);
};
