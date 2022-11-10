import type { Program } from "@project-serum/anchor";
import useSWR from "swr";
import { PoolAuthority } from "@twamm/client.js";
import { PublicKey } from "@solana/web3.js";
import { zipWith } from "ramda";

import useProgram from "./use-program";
import { expirationTimeToInterval } from "../utils/index";

export type TradeIntervals = IndexedTIF;

type SettledTokenPairPool<T = TokenPairPoolData> = PromiseSettledResult<T>;

type FulfilledTifWithPool = {
  tif: TIF;
  index: TIFIndex;
  status: "fulfilled" | "rejected";
  data?: TokenPairPoolData;
};

type TifWithPool = FulfilledTifWithPool;

const swrKey = (params: {
  tokenPair: TokenPair<JupToken>;
  tifs: number[];
  currentPoolPresent: boolean[];
  poolCounters: PoolCounter[];
}) => ({
  key: "tokenPairOrderIntervals",
  params,
});

const populateTokenPairPool = <A, B, C>(
  x: [A, B],
  y: SettledTokenPairPool<C>
) => ({
  tif: x[0],
  index: x[1],
  status: y.status,
  data: y.status === "fulfilled" ? y.value : undefined,
});

const fetcher =
  (program: Program) =>
  async ({ params }: ReturnType<typeof swrKey>) => {
    const { tokenPair, tifs, currentPoolPresent, poolCounters } = params;
    const [a, b] = tokenPair;

    const aAddress = new PublicKey(a.address);
    const bAddress = new PublicKey(b.address);
    const pool = new PoolAuthority(program, aAddress, bAddress);

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

    if (poolsToFetch.length) {
      const pools: unknown = await Promise.allSettled(
        poolsToFetch.map(([tif, index]) =>
          pool.getPoolByTIF(tif, poolCounters[index])
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

      return allTifs;
    }

    return indexedTifs;
  };

export default (
  tokenPair: TokenPair<JupToken> | undefined,
  tifs: number[] | undefined,
  currentPoolPresent: boolean[] | undefined,
  poolCounters: PoolCounter[] | undefined,
  options = {}
) => {
  const { program } = useProgram();

  const isValid = tokenPair && tifs && currentPoolPresent && poolCounters;

  return useSWR(
    isValid &&
      swrKey({
        tokenPair,
        tifs,
        currentPoolPresent,
        poolCounters,
      }),
    fetcher(program),
    options
  );
};
