import type { Provider, Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import swr from "swr";
import { Order } from "@twamm/client.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { dedupeEach } from "../utils/api";
import { useProgram } from "./use-program";

const swrKey = (params: { account: PublicKey }) => ({
  key: "Orders",
  params,
});

const fetcher =
  (provider: Provider, program: Program) =>
  async ({ params: { account } }: ReturnType<typeof swrKey>) => {
    const order = new Order(program, provider);

    const orders = await order.getOrders(account);

    return orders;
  };

export const useAccountOrders = () => {
  const { publicKey: account } = useWallet();
  const { program, provider } = useProgram();

  return swr(
    account && swrKey({ account }),
    fetcher(provider, program),
    dedupeEach()
  );
};
