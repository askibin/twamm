import type { Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import { Pool } from "@twamm/client.js";
import useSWR from "swr";

import useProgram from "./use-program";

const swrKey = (params: { address: PublicKey }) => ({
  key: "pool",
  params,
});

type Params = Parameters<typeof swrKey>[0];

const fetcher = (program: Program) => {
  const poolClient = new Pool(program);

  return async ({ params: { address } }: ReturnType<typeof swrKey>) => {
    const pool = (await poolClient.getPool(address)) as PoolData;

    return pool;
  };
};

export default (address?: Params["address"], options = {}) => {
  const { program } = useProgram();

  return useSWR(address && swrKey({ address }), fetcher(program), options);
};
