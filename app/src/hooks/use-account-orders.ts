import type { Provider, Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import swr from "swr";
import { Order } from "@twamm/client.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { dedupeEach, revalOnFocus } from "../utils/api";
import { useProgram } from "./use-program";

const swrKey = (params: { account: PublicKey }) => ({
  key: "Orders",
  params,
});

const fetcher =
  (provider: Provider, program: Program) =>
  async ({ params: { account } }: ReturnType<typeof swrKey>) => {
    const order = new Order(program, provider);

    console.log("fetch orders", account.toBase58(), provider, program);

    const orders = await order.getOrders(account);

    return orders;
  };

export const useAccountOrders = () => {
  const { publicKey: account } = useWallet();
  const { program, provider } = useProgram();

  const opts = { ...dedupeEach(5e3), ...revalOnFocus() };

  return swr(
    account && swrKey({ account }),
    fetcher(provider, program),
    opts
  );
};
