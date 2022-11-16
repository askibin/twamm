import type { Provider, Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { Order, Pool } from "@twamm/client.js";
import { useWallet } from "@solana/wallet-adapter-react";

import useProgram from "./use-program";

const swrKey = (params: { account: PublicKey | null }) => ({
  key: "orders",
  params,
});

const generateId = (arr: Array<string>) => arr[0];

const fetcher = (provider: Provider, program: Program) => {
  const order = new Order(program, provider);
  const pool = new Pool(program);

  return async ({ params: { account } }: ReturnType<typeof swrKey>) => {
    const orders: unknown = await order.getOrders(account);

    const list = orders as OrderData[];

    const pools = (await Promise.all(
      list.map((o) => pool.getPool(o.pool))
    )) as PoolData[];

    const orderAddresses = await Promise.all(
      list.map((o) => order.getAddressByPool(o.pool))
    );

    const records = list.map((orderData, i) => {
      const o = orderData as OrderPoolRecord;

      o.id = generateId([String(o.pool)]);
      o.poolData = pools[i];
      o.order = orderAddresses[i];

      return o;
    });

    return records;
  };
};

export default (_: void, options = {}) => {
  const { publicKey: account } = useWallet();
  const { program, provider } = useProgram();

  return useSWR(swrKey({ account }), fetcher(provider, program), options);
};
