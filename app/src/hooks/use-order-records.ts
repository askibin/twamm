import type { Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import Maybe, { Extra } from "easy-maybe/lib";
import useSWR from "swr";
import { TokenPair } from "@twamm/client.js";
import { useWallet } from "@solana/wallet-adapter-react";

import useOrders from "./use-orders";
import usePools from "./use-pools-by-addresses";
import useProgram from "./use-program";
import { dedupeEach, refreshEach } from "../swr-options";

const { andMap, of, withDefault } = Maybe;

const swrKey = (params: {
  account: PublicKey | null;
  orders: OrderData[];
  pools: PoolData[];
}) => ({
  key: "orderRecords",
  params,
});

const generateId = (arr: Array<string>) => arr[0];

const fetcher = (program: Program) => {
  const pair = new TokenPair(program);

  return async ({ params: { orders, pools } }: ReturnType<typeof swrKey>) => {
    const list = orders as OrderData[];

    const poolAddresses = pools.map((p) => p.tokenPair);

    const tokenPairs = (await pair.getPairs(
      poolAddresses
    )) as TokenPairProgramData[];

    // TODO: improve type resolving
    const records = list.map((orderData, i) => {
      const o = orderData as OrderPoolRecord;
      const record = { ...orderData } as OrderPoolRecord;

      record.id = generateId([String(o.pool)]);
      record.poolData = pools[i];
      record.order = o.pubkey;
      record.tokenPairData = tokenPairs[i];

      return record;
    });

    return records;
  };
};

export default (_: void, options = {}) => {
  const { publicKey: account } = useWallet();
  const { program } = useProgram();

  const orders = useOrders(undefined, {
    ...dedupeEach(60e3),
    ...refreshEach(3 * 60e3),
  });

  const ordersAddresses = withDefault(
    undefined,
    andMap((o) => ({ addresses: o.map((a) => a.pool) }), of(orders.data))
  );

  const pools = usePools(ordersAddresses);

  return useSWR(
    withDefault(
      undefined,
      andMap(
        ([a, o, p]) => swrKey({ account: a, orders: o, pools: p }),
        Extra.combine3([of(account), of(orders.data), of(pools.data)])
      )
    ),
    fetcher(program),
    options
  );
};
