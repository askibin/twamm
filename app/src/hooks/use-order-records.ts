import type { Provider, Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import Maybe from "easy-maybe/lib";
import useSWR from "swr";
import { Order, Pool, TokenPair } from "@twamm/client.js";
import { useWallet } from "@solana/wallet-adapter-react";

import useOrders from "./use-orders";
import usePools from "./use-pools-by-addresses";
import useProgram from "./use-program";
import { dedupeEach, refreshEach } from "../swr-options";

const { andMap, of, withDefault } = Maybe;

const swrKey = (params: {
  account: PublicKey | null;
  orders: OrderData[];
}) => ({
  key: "orderRecords",
  params,
});

const generateId = (arr: Array<string>) => arr[0];

const fetcher1 = (provider: Provider, program: Program) => {
  const order = new Order(program, provider);
  const pool = new Pool(program);
  const pair = new TokenPair(program);

  return async ({ params: { account } }: ReturnType<typeof swrKey>) => {
    const orders: unknown = await order.getOrders(account);

    const list = orders as OrderData[];

    const pools = (await Promise.all(
      list.map((o) => pool.getPool(o.pool))
    )) as PoolData[];

    const orderAddresses = await Promise.all(
      list.map((o) => order.getAddressByPool(o.pool))
    );

    const tokenPairs = (await Promise.all(
      pools.map((p) => pair.getPair(p.tokenPair))
    )) as TokenPairProgramData[];

    const records = list.map((orderData, i) => {
      const o = orderData as OrderPoolRecord;

      o.id = generateId([String(o.pool)]);
      o.poolData = pools[i];
      o.order = orderAddresses[i];
      o.tokenPairData = tokenPairs[i];

      return o;
    });

    return records;
  };
};

const fetcher = (provider: Provider, program: Program) => {
  const order = new Order(program, provider);
  const pool = new Pool(program);
  const pair = new TokenPair(program);

  return async ({ params: { account, orders } }: ReturnType<typeof swrKey>) => {
    console.log("ord", orders);

    //const orders: unknown = await order.getOrders(account);

    const list = orders as OrderData[];

    /*
     *    const pools = (await Promise.all(
     *      list.map((o) => pool.getPool(o.pool))
     *    )) as PoolData[];
     *
     *    const orderAddresses = await Promise.all(
     *      list.map((o) => order.getAddressByPool(o.pool))
     *    );
     *
     *    const tokenPairs = (await Promise.all(
     *      pools.map((p) => pair.getPair(p.tokenPair))
     *    )) as TokenPairProgramData[];
     */

    const records = list.map((orderData, i) => {
      const o = orderData as OrderPoolRecord;

      o.id = Math.random();

      //o.id = generateId([String(o.pool)]);
      /*
       *o.poolData = pools[i];
       *o.order = orderAddresses[i];
       *o.tokenPairData = tokenPairs[i];
       */

      return o;
    });

    return records;
  };
};

export default (_: void, options = {}) => {
  const { publicKey: account } = useWallet();
  const { program, provider } = useProgram();

  const orders = useOrders(undefined, {
    ...dedupeEach(60e3),
    ...refreshEach(3 * 60e3),
  });

  const ordersAddresses = withDefault(
    undefined,
    andMap((o) => ({ addresses: o.map((a) => a.pool) }), of(orders.data))
  );

  const pools = usePools(ordersAddresses);

  console.log({ pools });

  return useSWR(
    withDefault(
      undefined,
      andMap((o) => swrKey({ account, orders: o }), of(orders.data))
    ),
    fetcher(provider, program),
    options
  );
};
