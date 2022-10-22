import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

import { address as addr } from "../utils/twamm-client";
import { useJupTokensByMint } from "./use-jup-tokens-by-mint";
import { usePoolWithPair } from "./use-pool-with-pair";

const mintsKey = (pair?: TokenPairAccountData) =>
  pair
    ? [addr(pair.configA.mint).toString(), addr(pair.configB.mint).toString()]
    : undefined;

export const usePoolDetails = (address: PublicKey) => {
  const details = usePoolWithPair(address);

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
        aAddress: configA.mint,
        bAddress: configB.mint,
        expirationTime: new Date(expirationTime.toNumber() * 1e3),
        expired: Boolean(status.expired),
        inactive: Boolean(status.inactive),
        inceptionTime: new Date(inceptionTime.toNumber() * 1e3),
        lastBalanceChangeTime: new Date(lastBalanceChangeTime.toNumber() * 1e3),
        lpSupply: [
          sellSide.lpSupply.toNumber() / 10 ** configA.decimals,
          buySide.lpSupply.toNumber() / 10 ** configB.decimals,
        ],
        lpSupplyRaw: [
          sellSide.lpSupply.toNumber(),
          buySide.lpSupply.toNumber(),
        ],
        lpSymbols: [tokens.data[0].symbol, tokens.data[1].symbol],
        poolAddress: address,
        prices: [min.toFixed(2), ((max + min) / 2).toFixed(2), max.toFixed(2)],
        volume: statsA.orderVolumeUsd + statsB.orderVolumeUsd,
      };

      return next;
    }
  );
};
