import type { Provider, Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import swr from "swr";
import { findAddress } from "@twamm/client.js/lib/program";
import { useWallet } from "@solana/wallet-adapter-react";

import type { APIHook } from "../utils/api";
import { dedupeEach, revalOnFocus } from "../utils/api";
import { fetchOrderByPoolAddress } from "../utils/tokenpair-twamm-client";
import { useProgram } from "./use-program";
import { useOrders } from "./use-orders";

const swrKey = (params: { account: PublicKey }) => ({
  key: "accountOrders",
  params,
});

const fetcher = (provider: Provider, program: Program) => {
  const findProgramAddress = findAddress(program);
  const fetchTokenPair = fetchOrderByPoolAddress(provider, program);
  return async ({ params: { account, orders } }: ReturnType<typeof swrKey>) => {
    console.log(77, { orders });

    orders.forEach((order) => {
      console.log(
        "match",
        order.owner.toBase58(),
        account.toBase58(),
        order.owner === account
      );
    });

    //const pools = await Promise.all(
    //orders.map((order) => program.account.pool.fetch(order.pool))
    //);

    //const pairs = await Promise.all(
    //pools.map((pool) => program.account.tokenPair.fetch(pool.tokenPair))
    //);

    const tokenPairs = await Promise.all(
      orders.map((order) => fetchTokenPair(order.pool))
    );

    console.log(88, tokenPairs);

    return orders;
  };
};

export const useAccountOrders: APIHook<void, any> = (_, options = {}) => {
  const { publicKey: account } = useWallet();
  const { program, provider } = useProgram();

  const orders = useOrders();

  const opts = { ...dedupeEach(5e3), ...revalOnFocus(), ...options };

  const pair = swr(
    account && orders.data && swrKey({ account, orders: orders.data }),
    fetcher(provider, program),
    opts
  );

  return swr(pair.data && "orderTokenPair");
};
