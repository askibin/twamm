import type { Connection, PublicKey } from "@solana/web3.js";
import type { DefaultApi } from "@jup-ag/api";
import {
  ComputeBudgetProgram,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import type { Route } from "./use-swap-routes-from-jup";
import useBlockchain from "../contexts/solana-connection-context";
import useJupiterContext from "../contexts/jupiter-connection-context";
import useTxRunner from "../contexts/transaction-runner-context";
import { JUPITER_CONFIG_URI } from "../env";

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

async function v4SwapPost(route: Route, userPublicKey: string) {
  const transactions = await (
    await fetch(`${JUPITER_CONFIG_URI}/v4/swap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route,
        userPublicKey,
      }),
    })
  ).json();

  return transactions;
}

/* eslint-disable */
async function runVersionedTransaction(
  connection: Connection,
  signTransaction: (t: Transaction) => Promise<Transaction>,
  api: DefaultApi,
  route: Route,
  userPublicKey: PublicKey
) {
  const { swapTransaction } = await v4SwapPost(route, userPublicKey.toBase58());

  const rawTransaction = Buffer.from(swapTransaction, "base64");

  const transactionMessage =
    VersionedTransaction.deserialize(rawTransaction).message;

  const transaction = new VersionedTransaction(transactionMessage);

  return null;
}
/* eslint-enable */

async function runLegacyTransaction(
  connection: Connection,
  signTransaction: (t: Transaction) => Promise<Transaction>,
  api: DefaultApi,
  route: Route,
  userPublicKey: PublicKey
) {
  const { swapTransaction } = await api.v3SwapPost({
    // @ts-expect-error > Route.swapMode
    body: { route, userPublicKey: userPublicKey.toBase58() },
  });

  if (!swapTransaction) throw new Error("Could not fetch the transaction data");

  const rawTransaction = Buffer.from(swapTransaction, "base64");

  const transaction = Transaction.from(rawTransaction);

  console.log("opt", transaction);

  const recentBlockhash = await connection.getRecentBlockhash();

  transaction.recentBlockhash = recentBlockhash.blockhash;
  transaction.feePayer = userPublicKey;

  await verifyTransaction(transaction, userPublicKey);

  // await signTransaction(transaction);

  const sim = await connection.simulateTransaction(transaction);

  const txHash = transaction.serialize();
  console.log("opt", txHash, sim);

  const { unitsConsumed } = sim.value;

  const performanceFee = 5000; // lamports

  const microLamportsCUnitPrice = Number.parseInt(
    performanceFee / unitsConsumed / 1e-6
  );

  console.log("opt", microLamportsCUnitPrice);

  transaction.add(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: microLamportsCUnitPrice,
    })
  );

  await signTransaction(transaction);

  const txid = await connection.sendRawTransaction(transaction.serialize());

  console.log("opt txid", txid);

  // TODO: resolve deprecation
  await connection.confirmTransaction(txid);

  return txid;
}

export default () => {
  const { publicKey, signTransaction, ...args } = useWallet();
  const { connection } = useBlockchain();
  const { api } = useJupiterContext();
  const { commit } = useTxRunner();

  const run = async (routes: Route[]) => {
    if (!publicKey || !signTransaction)
      throw new Error("Can not find the wallet");

    const route = predictBestRoute(routes[0], routes);

    if (!route) throw new Error("Can not find the route");

    console.log("opt", { args });

    // TODO: resolve issues with wallet provider to support VersionedTransactions
    return await runLegacyTransaction(
      connection,
      signTransaction,
      api,
      route,
      publicKey
    );
  };

  return {
    execute: async (routes: Route[]) => {
      const data = await commit(run(routes));

      return data;
    },
  };
};
