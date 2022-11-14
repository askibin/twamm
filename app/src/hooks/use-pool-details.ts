import type { PublicKey } from "@solana/web3.js";
import type { BN } from "@project-serum/anchor";
import useSWR from "swr";

import useJupTokensByMint from "./use-jup-tokens-by-mint";
import usePoolWithPair from "./use-pool-with-pair";
import {
  address as addr,
  lpAmount,
  withdrawAmount,
} from "../utils/twamm-client";

const mintsKey = (pair?: TokenPairAccountData) =>
  pair
    ? [addr(pair.configA.mint).toString(), addr(pair.configB.mint).toString()]
    : undefined;

export default (
  poolAddress: PublicKey,
  order: { side: OrderTypeStruct; tokenDebt: BN; lpBalance: BN }
) => {
  const details = usePoolWithPair(poolAddress);

  const tokens = useJupTokensByMint(mintsKey(details.data?.pair));

  const isValid = poolAddress && details.data && tokens.data && order;
  return useSWR(
    isValid && ["poolDetails", poolAddress],
    async (): Promise<PoolDetails | undefined> => {
      if (!details.data) return undefined;
      if (!tokens.data) return undefined;

      const { side } = order;

      const { pool, pair } = details.data;

      const { configA, configB, inceptionTime, statsA, statsB } = pair;
      const { buySide, expirationTime, sellSide, status } = pool;

      const tradeSide = side.sell ? sellSide : buySide;
      const {
        lastBalanceChangeTime,
        maxFillPrice: max,
        minFillPrice: min,
      } = tradeSide; // buySide;

      const lastChanged = lastBalanceChangeTime.toNumber();

      // weightedfillsum / fillsVolume = avg

      const withdrawData = withdrawAmount(tradeSide, order, pair);
      const lpAmountData = lpAmount(tradeSide, order);

      const next = {
        aAddress: configA.mint,
        bAddress: configB.mint,
        expirationTime: new Date(expirationTime.toNumber() * 1e3),
        expired: Boolean(status.expired),
        inactive: Boolean(status.inactive),
        inceptionTime: new Date(inceptionTime.toNumber() * 1e3),
        lastBalanceChangeTime: !lastChanged
          ? undefined
          : new Date(lastChanged * 1e3),
        lpAmount: lpAmountData,
        lpSupply: [
          sellSide.lpSupply.toNumber() / 10 ** configA.decimals, // sellSide.sourceBalance , buySide.targetBalance
          buySide.lpSupply.toNumber() / 10 ** configB.decimals, // sellSide.targetBalance + buySide.sourceBalance
        ],
        lpSupplyRaw: [
          sellSide.lpSupply.toNumber(),
          buySide.lpSupply.toNumber(),
        ],
        lpSymbols: [tokens.data[0].symbol, tokens.data[1].symbol],
        poolAddress,
        prices: [min.toFixed(2), ((max + min) / 2).toFixed(2), max.toFixed(2)],
        side,
        volume: statsA.orderVolumeUsd + statsB.orderVolumeUsd,
        withdrawData,
      };

      return next;
    }
  );
};
