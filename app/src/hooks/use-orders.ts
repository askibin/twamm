import type { Order as TOrder } from "@twamm/types";
import type { Provider, Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { Order } from "@twamm/client.js";
import { useWallet } from "@solana/wallet-adapter-react";

import useProgram from "./use-program";

const swrKey = (params: { account: PublicKey | null }) => ({
  key: "orders",
  params,
});

const fetcher = (provider: Provider, program: Program) => {
  const order = new Order(program, provider);

  return async ({ params }: SWRParams<typeof swrKey>) => {
    const orders: unknown = await order.getOrdersByAccount(params.account);

    return orders as TOrder[];
  };
};

export default (_: void, options = {}) => {
  const { publicKey: account } = useWallet();
  const { program, provider } = useProgram();

  return useSWR(swrKey({ account }), fetcher(provider, program), options);
};
