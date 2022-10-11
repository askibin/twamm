import type { Provider, Program } from "@project-serum/anchor";
import swr from "swr";
import { Pool } from "@twamm/client.js";
import { PublicKey } from "@solana/web3.js";

import { useProgram } from "./use-program";

const fetcher = (provider: Provider, program: Program) => async (params) => {
  const [, tifs, currentPoolPresent, poolCounters, aMint, bMint] = params;

  const aAddress = new PublicKey(aMint);
  const bAddress = new PublicKey(bMint);
  const pool = new Pool(program, aAddress, bAddress);

  await pool.init();

  const intervals = new Map();

  console.log("DD", currentPoolPresent, poolCounters, tifs);

  tifs.forEach((tif: number, index: number) => {
    if (tif === 0) return;

    const hasCurrentPool = currentPoolPresent[index];
    const nextInterval = { index, tif, hasCurrentPool };

    intervals.set(index, nextInterval);
  });

  const poolsToFetch: Array<[number, number]> = Array.from(intervals.values())
    .filter(({ hasCurrentPool }) => hasCurrentPool)
    .map(({ tif, index }) => [tif, index]);

  console.log({ poolsToFetch }, poolCounters);

  const availablePoolsRecords = new Map();

  if (poolsToFetch.length) {
    const pools = await Promise.allSettled(
      poolsToFetch.map(([tif, index]) => {
        return pool.getPool(tif, poolCounters[index]);
      })
    );

    const indexedPools = poolsToFetch.map((poolToFetch, index) => {
      return [pools[index], poolToFetch[1]];
    });

    const availablePools = indexedPools
      .filter(([p]) => p.status === "fulfilled")
      .map(([p, index]) => [p.value, index])
      .map(([p, index]) => ({
        tif: p.timeInForce,
        left: p.expirationTime.toNumber(),
        index,
      }));

    availablePools.forEach((apool) => {
      availablePoolsRecords.set(apool.index, apool);
    });

    console.log("PP", indexedPools, availablePools, pools);
  }

  const enrichedTifs = tifs.map((tif, index) => {
    const record = availablePoolsRecords.get(index);
    return { tif, index, left: record ? record.left : undefined };
  });

  console.log("PPP", enrichedTifs);

  return enrichedTifs; //tifs;
};

export const useTIFIntervals = ({
  currentPoolPresent,
  tifs,
  poolCounters,
  aMint,
  bMint,
} = {}) => {
  const { provider, program } = useProgram();

  const opts = { refreshInterval: 5000 };

  return swr(
    tifs && ["TIF", tifs, currentPoolPresent, poolCounters, aMint, bMint],
    fetcher(provider, program),
    opts
  );
};
