import type { Program } from "@project-serum/anchor";
import useSWR from "swr";
import { PoolAuthority } from "@twamm/client.js";
import { PublicKey } from "@solana/web3.js";
import { zipWith } from "ramda";

import type { IndexedTIF, PoolTIF } from "../domain/interval.d";
import useProgram from "./use-program";
import { expirationTimeToInterval } from "../utils/index";

type SettledTokenPairPool<T = TokenPairPoolData> = PromiseSettledResult<T>;

type TifWithPool = {
  data?: TokenPairPoolData;
  index: TIFIndex;
  status: "fulfilled" | "rejected";
  tif: TIF;
};

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
  data: y.status === "fulfilled" ? y.value : undefined,
  index: x[1],
  status: y.status,
  tif: x[0],
});

const fetcher =
  (program: Program) =>
  async ({ params }: SWRParams<typeof swrKey>) => {
    const { tokenPair, tifs, currentPoolPresent, poolCounters } = params;
    const [a, b] = tokenPair;

    const aAddress = new PublicKey(a.address);
    const bAddress = new PublicKey(b.address);
    const pool = new PoolAuthority(program, aAddress, bAddress);

    await pool.init();

    const intervals = new Map();

    tifs.forEach((tif: number, index: number) => {
      if (tif === 0) return;
      // exclude unavailable intervals

      const hasCurrentPool = currentPoolPresent[index];
      const nextInterval = { index, tif, hasCurrentPool };

      intervals.set(index, nextInterval);
    });
    // collect initialized intervals

    const intervalTifs = Array.from(intervals.values());

    const indexedTifs = intervalTifs.map<IndexedTIF>((interval) => ({
      tif: interval.tif,
      index: interval.index,
      left: interval.tif,
    }));
    // populate intervals with proper struct

    const poolsToFetch = intervalTifs
      .filter(({ hasCurrentPool }) => hasCurrentPool)
      .map<[TIF, TIFIndex]>(({ tif, index }) => [tif, index]);
    // aggregate data to fetch active pools

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
        .filter((d) => d.status === "fulfilled")
        .map<PoolTIF>(({ tif, index, data }) => ({
          tif,
          left: expirationTimeToInterval(data?.expirationTime.toNumber(), tif),
          index,
          poolStatus: data?.status,
        }));

      const availablePoolsRecords = new Map<number, PoolTIF>();

      availablePools.forEach((p) => {
        availablePoolsRecords.set(p.index, p);
      });

      const allTifs: PoolTIF[] = [];
      indexedTifs.forEach((indexedTif) => {
        if (availablePoolsRecords.has(indexedTif.index)) {
          const poolTif = availablePoolsRecords.get(indexedTif.index);
          allTifs.push(poolTif as NonNullable<typeof poolTif>);
        } else {
          allTifs.push(indexedTif);
        }
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
