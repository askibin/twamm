import type { Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import { Pool, TokenPair } from "@twamm/client.js";
import useSWR from "swr";

import useProgram from "./use-program";

const swrKey = (params: { address: PublicKey }) => ({
  key: "poolWithPair",
  params,
});

type Params = Parameters<typeof swrKey>[0];

const fetcher = (program: Program) => {
  const poolClient = new Pool(program);
  const pairClient = new TokenPair(program);

  return async ({ params: { address } }: ReturnType<typeof swrKey>) => {
    const pool = (await poolClient.getPool(address)) as PoolData;

    const tp: unknown = await pairClient.getPair(pool.tokenPair);
    const tokenPair = tp as TokenPairProgramData;

    return { pool, pair: tokenPair };
  };
};

export default (address: Params["address"], options = {}) => {
  const { program } = useProgram();

  return useSWR(address && swrKey({ address }), fetcher(program), options);
};
