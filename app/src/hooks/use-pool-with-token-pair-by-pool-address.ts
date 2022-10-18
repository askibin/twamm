import type { Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import swr from "swr";
import { useWallet } from "@solana/wallet-adapter-react";

import type { APIHook } from "../utils/api";
import { dedupeEach, revalOnFocus } from "../utils/api";
import { useProgram } from "./use-program";

const swrKey = (params: { account: PublicKey; address: PublicKey }) => ({
  key: "poolWithPairByPoolAddress",
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

    return { pool, pair: tokenPair };
  };

export const usePoolWithTokenPairByPoolAddress: APIHook<
  Pick<Params, "address">,
  { pool: PoolData; pair: TokenPairAccountData }
> = (params, options = {}) => {
  const { address } = params ?? {};
  const { publicKey: account } = useWallet();
  const { program } = useProgram();

  const opts = { ...dedupeEach(5e3), ...revalOnFocus(), ...options };

  return swr(
    address && account && swrKey({ address, account }),
    fetcher(program),
    opts
  );
};
