import type { Program } from "@project-serum/anchor";
import swr from "swr";
import { Pool } from "@twamm/client.js";
import { PublicKey } from "@solana/web3.js";
import { zipWith } from "ramda";

import type { APIHook } from "../utils/api";
import { useProgram } from "./use-program";

export type TradeIntervals = {
  indexedTifs: IndexedTIF;
  intervals: any;
  tifs: number[];
};

type TokenPairPoolData = {
  buySide: {
    maxFillPrice: number;
    minFillPrice: number;
  };
  expirationTime: {
    toNumber(): number;
  };
  sellSide: {
    maxFillPrice: number;
    minFillPrice: number;
  };
  timeInForce: number;
  // status: { locked: {} }
};

type SettledTokenPairPool<T = TokenPairPoolData> =
  | PromiseSettledResult<T>
  | PromiseRejectedResult;

type FulfilledTifWithPool = {
  tif: TIF;
  index: TIFIndex;
  status: "fulfilled" | "rejected";
  data?: TokenPairPoolData;
};

type TifWithPool = FulfilledTifWithPool;

const swrKey = (params: {
  tokenPair: TokenPair;
  tifs: number[];
  currentPoolPresent: boolean[];
  poolCounters: PoolCounter[];
}) => ({
  key: "tokenPairOrderIntervals",
  params,
});

type Params = Parameters<typeof swrKey>[0];

const populateTokenPairPool = <A, B, C>(
  x: [A, B],
  y: SettledTokenPairPool<C>
) => ({
  tif: x[0],
  index: x[1],
  status: y.status,
  data: y.status === "fulfilled" ? y.value : undefined,
});

const expirationTimeToInterval = (
  expirationTime: number | undefined,
  tif: number
) => {
  if (!expirationTime) return tif;

  let delta = expirationTime * 1e3 - Date.now();
  delta = delta <= 0 ? 0 : Number((delta / 1e3).toFixed(0));

  return delta;
};

const fetcher =
  (program: Program) =>
  async ({ params }: ReturnType<typeof swrKey>) => {
    const { tokenPair, tifs, currentPoolPresent, poolCounters } = params;
    const [a, b] = tokenPair;

    const aAddress = new PublicKey(a.address);
    const bAddress = new PublicKey(b.address);
    const pool = new Pool(program, aAddress, bAddress);

    await pool.init();

    const intervals = new Map();

    tifs.forEach((tif: number, index: number) => {
      if (tif === 0) return;

      const hasCurrentPool = currentPoolPresent[index];
      const nextInterval = { index, tif, hasCurrentPool };

      intervals.set(index, nextInterval);
    });

    const indexedTifs = Array.from(intervals.values()).map((interval) => ({
      tif: interval.tif,
      index: interval.index,
      left: interval.tif,
    }));

    const poolsToFetch: Array<[TIF, TIFIndex]> = Array.from(intervals.values())
      .filter(({ hasCurrentPool }) => hasCurrentPool)
      .map(({ tif, index }) => [tif, index]);

    const availablePoolsRecords = new Map();

    console.log('fetch')

    if (poolsToFetch.length) {
      const pools: unknown = await Promise.allSettled(
        poolsToFetch.map(([tif, index]) =>
          pool.getPool(tif, poolCounters[index])
        )
      );

      const fetchedPools = pools as Array<SettledTokenPairPool>;

      const zippedPools: TifWithPool[] = zipWith(
        (x, y) => populateTokenPairPool(x, y),
        poolsToFetch,
        fetchedPools
      );

      const availablePools = zippedPools
        .filter(({ status }) => status === "fulfilled")
        .map(({ tif, index, data }) => ({
          tif,
          left: expirationTimeToInterval(data?.expirationTime.toNumber(), tif),
          index,
        }));

      availablePools.forEach((p) => {
        availablePoolsRecords.set(p.index, p);
      });

      const allTifs: Array<{ tif: TIF; left: number; index: TIFIndex }> = [];
      indexedTifs.forEach((indexedTif) => {
        allTifs.push(
          availablePoolsRecords.has(indexedTif.index)
            ? availablePoolsRecords.get(indexedTif.index)
            : indexedTif
        );
      });

      return { indexedTifs: allTifs, tifs };
    }

    return { indexedTifs, tifs };
  };

export const useTIFIntervals: APIHook<Params, TradeIntervals> = (
  { tokenPair, currentPoolPresent, tifs, poolCounters } = {},
  options = {}
) => {
  const { program } = useProgram();

  const opts = { refreshInterval: 180e3, ...options };

  const isValid = tokenPair && tifs && currentPoolPresent && poolCounters;

  return swr(
    isValid && swrKey({ tokenPair, tifs, currentPoolPresent, poolCounters }),
    fetcher(program),
    opts
  );
};
