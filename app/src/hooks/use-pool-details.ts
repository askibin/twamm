import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

import { address } from "../utils/twamm-client";
import { useJupTokensByMint } from "./use-jup-tokens-by-mint";
import { usePoolWithTokenPairByPoolAddress } from "./use-pool-with-token-pair-by-pool-address";

export interface PoolDetails {
  expirationTime: Date;
  expired: boolean;
  inactive: boolean;
  inceptionTime: Date;
  lastBalanceChangeTime: Date;
  lpSupply: number[];
  lpSymbols: string[];
  prices: string[];
}

const mintsKey = (pair?: TokenPairAccountData) =>
  pair
    ? [
        address(pair.configA.mint).toString(),
        address(pair.configB.mint).toString(),
      ]
    : undefined;

export const usePoolDetails = (address: PublicKey) => {
  const details = usePoolWithTokenPairByPoolAddress(
    address ? { address } : undefined
  );

  const tokens = useJupTokensByMint(mintsKey(details.data?.pair));

  const isValid = address && details.data && tokens.data;
  return useSWR(
    isValid && ["poolDetails", address],
    async (): Promise<PoolDetails | undefined> => {
      if (!details.data) return undefined;
      if (!tokens.data) return undefined;

      const { pool, pair } = details.data;

      const { configA, configB, inceptionTime, statsA, statsB } = pair;
      const { buySide, expirationTime, sellSide, status } = pool;
      const { maxFillPrice: maxBuy, minFillPrice: minBuy } = buySide;
      const {
        lastBalanceChangeTime,
        maxFillPrice: maxSell,
        minFillPrice: minSell,
      } = sellSide;

      const min = minSell || minBuy;
      const max = maxSell || maxBuy;

      const next = {
        expirationTime: new Date(expirationTime.toNumber() * 1e3),
        expired: Boolean(status.expired),
        inactive: Boolean(status.inactive),
        inceptionTime: new Date(inceptionTime.toNumber() * 1e3),
        lastBalanceChangeTime: new Date(lastBalanceChangeTime.toNumber() * 1e3),
        lpSupply: [
          sellSide.lpSupply.toNumber() / 10 ** configA.decimals,
          buySide.lpSupply.toNumber() / 10 ** configB.decimals,
        ],
        lpSymbols: [tokens.data[0].symbol, tokens.data[1].symbol],
        prices: [min.toFixed(2), ((max + min) / 2).toFixed(2), max.toFixed(2)],
        volume: statsA.orderVolumeUsd + statsB.orderVolumeUsd,
      };

      console.log({ next });

      return next;
    }
  );
};
