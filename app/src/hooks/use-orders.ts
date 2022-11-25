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

  return async ({ params: { account } }: ReturnType<typeof swrKey>) => {
    const orders = (await order.getOrders(account)) as OrderData[];

    return orders;
  };
};

export default (_: void, options = {}) => {
  const { publicKey: account } = useWallet();
  const { program, provider } = useProgram();

  return useSWR(swrKey({ account }), fetcher(provider, program), options);
};
