import type { Program } from "@project-serum/anchor";
import swr from "swr";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Pool } from "@twamm/client.js";

import { useProgram } from "./use-program";
import { useTokenPair } from "./use-token-pair";

const fetcher = (getProgram: Promise<Program>, tokenPair: any) => async () => {
  const program = await getProgram;

  if (!tokenPair.data || tokenPair.error) {
    throw new Error("Can not fetch tokenPair");
  }

  const pairsData = tokenPair.data;
  const pair = pairsData[0];

  const pool = new Pool(program, pair.configA.mint, pair.configB.mint);

  await pool.init();

  // improve pool fetching by tif
  const poolData = await pool.getPool(pair.tifs[1], pair.poolCounters[1]);

  return poolData;
};

export const usePools = () => {
  const { program } = useProgram();
  const tokenPair = useTokenPair();

  const isValid = !tokenPair.isValidating;

  return swr(isValid && "Pools", fetcher(program, tokenPair), {});
};
