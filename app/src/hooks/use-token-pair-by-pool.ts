import type { Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";

import useProgram from "./use-program";

const swrKey = (params: { address: PublicKey }) => ({
  key: "tokenPairByPool",
  params,
});

type Params = Parameters<typeof swrKey>[0];

const fetcher =
  (program: Program) =>
  async ({ params: { address } }: ReturnType<typeof swrKey>) => {
    const p: unknown = await program.account.pool.fetch(address);
    const pool = p as PoolData;

    const tp: unknown = await program.account.tokenPair.fetch(pool.tokenPair);
    const tokenPair = tp as TokenPairAccountData;

    return tokenPair;
  };

export default (address: Params["address"], options = {}) => {
  const { program } = useProgram();

  return useSWR(address && swrKey({ address }), fetcher(program), options);
};
