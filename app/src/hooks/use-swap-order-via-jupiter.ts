import type { PublicKey } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import type { Route } from "./use-swap-routes-from-jup";
import useBlockchain from "../contexts/solana-connection-context";
import useJupiterContext from "../contexts/jupiter-connection-context";
import useTxRunner from "../contexts/transaction-runner-context";

const predictBestRoute = (r: Route, routes: Route[]) => {
  const amount = Number(r.otherAmountThreshold);
  const maxSlippage = 0.05;

  let bestRoute: Route | undefined;
  routes.forEach((route) => {
    if (bestRoute) return;
    const compared = (amount - Number(route.otherAmountThreshold)) / amount;

    if (compared > maxSlippage) return;

    bestRoute = route;
  });

  return bestRoute;
};

const verifyTransaction = async (tx: Transaction, owner: PublicKey) => {
  function checkKeys(t: Transaction, user: PublicKey) {
    const i = t.instructions.at(-1);
    const userAddress = user.toBase58();

    if (!i) throw new Error("Absent instructions");

    i.keys.forEach((key) => {
      if (key.isSigner && key.pubkey.toBase58() !== userAddress) {
        throw new Error("Owner addresses do not match");
      }
    });

    return t;
  }

  return checkKeys(tx, owner);
};

export default () => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useBlockchain();
  const { api } = useJupiterContext();
  const { commit, error, viewExplorer } = useTxRunner();

  const run = async (routes: Route[]) => {
    if (!publicKey || !signTransaction)
      throw new Error("Can not find the wallet");

    const route = predictBestRoute(routes[0], routes);

    if (!route) throw new Error("Can not find the route");

    const { swapTransaction } = await api.v3SwapPost({
      // @ts-expect-error > Route.swapMode
      body: { route, userPublicKey: publicKey.toBase58() },
    });

    if (!swapTransaction) throw new Error("Can not process the order");

    const transaction = Transaction.from(
      Buffer.from(swapTransaction, "base64")
    );

    await verifyTransaction(transaction, publicKey);

    await signTransaction(transaction);

    const txid = await connection.sendRawTransaction(transaction.serialize());

    await connection.confirmTransaction(txid);

    return txid;
  };

  return {
    execute: async (routes: Route[]) => {
      const data = await commit(run(routes));

      return data;
    },
  };
};
