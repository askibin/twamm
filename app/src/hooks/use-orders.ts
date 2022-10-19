import type { Provider, Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { Order } from "@twamm/client.js";
import { useWallet } from "@solana/wallet-adapter-react";

import type { APIHook } from "../utils/api";
import { useProgram } from "./use-program";

const swrKey = (params: { account: PublicKey }) => ({
  key: "orders",
  params,
});

const fetcher =
  (provider: Provider, program: Program) =>
  async ({ params: { account } }: ReturnType<typeof swrKey>) => {
    const order = new Order(program, provider);

    const orders: unknown = await order.getOrders(account);

    return orders as OrderData[];
  };

export const useOrders: APIHook<void, OrderData[]> = (_, options = {}) => {
  const { publicKey: account } = useWallet();
  const { program, provider } = useProgram();

  return useSWR(
    account && swrKey({ account }),
    fetcher(provider, program),
    options
  );
};
