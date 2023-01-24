import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

import useJupTokensByMint from "./use-jup-tokens-by-mint";
import usePoolWithPair from "./use-pool-with-pair";
import { address as addr } from "../utils/twamm-client";

const mintsKey = (pair?: TokenPairAccountData) =>
  pair
    ? [addr(pair.configA.mint).toString(), addr(pair.configB.mint).toString()]
    : undefined;

export default (poolAddress: PublicKey, order: OrderBalanceData) => {
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

      const [a, b] = tokens.data;

      // TODO: inception = expiration - timeInForce

      const { configA, configB, inceptionTime, statsA, statsB } = pair;
      const { buySide, expirationTime, sellSide, status } = pool;

      const tradeSide = side.sell ? sellSide : buySide;
      const {
        fillsVolume,
        lastBalanceChangeTime,
        maxFillPrice,
        minFillPrice,
        weightedFillsSum,
      } = tradeSide;

      const coins = side.sell ? [a, b] : [b, a];

      const configs = side.sell ? [configA, configB] : [configB, configA];

      const supply = side.sell
        ? [
            sellSide.sourceBalance / 10 ** configs[0].decimals,
            sellSide.targetBalance / 10 ** configs[1].decimals,
          ]
        : [
            buySide.sourceBalance / 10 ** configs[0].decimals,
            buySide.targetBalance / 10 ** configs[1].decimals,
          ];

      const lastChanged = lastBalanceChangeTime.toNumber();

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
        lpAmount: Number(order.lpBalance),
        lpSupply: supply,
        lpSupplyRaw: [
          sellSide.lpSupply.toNumber(),
          buySide.lpSupply.toNumber(),
        ],
        lpSymbols: [coins[0].symbol, coins[1].symbol],
        poolAddress,
        prices: [
          Number(minFillPrice),
          Number(fillsVolume)
            ? Number(weightedFillsSum) / Number(fillsVolume)
            : -1,
          Number(maxFillPrice),
        ],
        side,
        volume: statsA.orderVolumeUsd + statsB.orderVolumeUsd,
        withdraw: { tradeSide, orderBalance: order, tokenPair: pair },
      };

      return next;
    }
  );
};
