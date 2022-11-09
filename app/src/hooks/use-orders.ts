import type { Provider, Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { Order } from "@twamm/client.js";
import { useWallet } from "@solana/wallet-adapter-react";

import useProgram from "./use-program";
import { address } from "../utils/twamm-client";

const swrKey = (params: { account: PublicKey }) => ({
  key: "orders",
  params,
});

const generateId = (arr: Array<any>) => arr[0].toString();

const fetcher = (provider: Provider, program: Program) => {
  const order = new Order(program, provider);

  return async ({ params: { account } }: ReturnType<typeof swrKey>) => {
    const orders: unknown = await order.getOrders(account);

    const list = orders as OrderData[];

    const records = list.map((orderData) => {
      const { pool } = orderData;

      const poolStr = address(pool);

      return {
        ...orderData,
        id: generateId([poolStr]),
      };
    });

    return records;
  };
};

export default (_: void, options = {}) => {
  const { publicKey: account } = useWallet();
  const { program, provider } = useProgram();

  return useSWR(
    account && swrKey({ account }),
    fetcher(provider, program),
    options
  );
};
