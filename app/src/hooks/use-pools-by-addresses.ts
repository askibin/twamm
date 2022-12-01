import type { Provider, Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { Pool } from "@twamm/client.js";

import useProgram from "./use-program";

const swrKey = (params: { addresses: PublicKey[] }) => ({
  key: "pools",
  params,
});

const fetcher = (provider: Provider, program: Program) => {
  const pool = new Pool(program);

  return async ({ params: { addresses } }: ReturnType<typeof swrKey>) => {
    const pools = (await pool.getPools(addresses)) as PoolData[];

    return pools;
  };
};

export default (params?: Parameters<typeof swrKey>[0], options = {}) => {
  const { program, provider } = useProgram();

  return useSWR(params && swrKey(params), fetcher(provider, program), options);
};
