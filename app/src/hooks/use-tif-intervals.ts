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

  tifs.forEach((tif: number, index: number) => {
    if (tif === 0) return;

    const hasCurrentPool = currentPoolPresent[index];
    const nextInterval = { index, tif, hasCurrentPool };

    intervals.set(index, nextInterval);
  });

  const poolsToFetch: Array<[number, number]> = Array.from(intervals.values())
    .filter(({ hasCurrentPool }) => hasCurrentPool)
    .map(({ tif, index }) => [tif, index]);

  try {
    if (poolsToFetch.length) {
      const pools = await Promise.all(
        poolsToFetch.map(([tif, index]) => {
          return pool.getPool(tif, poolCounters[index]);
        })
      );
    }
  } catch (error) {
    console.log(error);
  }

  return tifs;
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
