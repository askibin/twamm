import type { Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { useWallet } from "@solana/wallet-adapter-react";

import { poolClient, tokenPairClient } from "../utils/twamm-client";
import useProgram from "./use-program";

const swrKey = (params: { account: PublicKey; address: PublicKey }) => ({
  key: "poolWithPair",
  params,
});

type Params = Parameters<typeof swrKey>[0];

const fetcher = (program: Program) => {
  const poolCli = poolClient(program.account);
  const tokenPairCli = tokenPairClient(program.account);

  return async ({ params: { address } }: ReturnType<typeof swrKey>) => {
    const p: unknown = await poolCli.getPool(address);
    const pool = p as PoolData;

    const tp: unknown = await tokenPairCli.getTokenPair(pool.tokenPair);
    const tokenPair = tp as TokenPairAccountData;

    return { pool, pair: tokenPair };
  };
};

export default (address: Params["address"], options = {}) => {
  const { publicKey: account } = useWallet();
  const { program } = useProgram();

  return useSWR(
    address && account && swrKey({ address, account }),
    fetcher(program),
    options
  );
};
