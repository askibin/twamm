import { BN } from "@project-serum/anchor";
import {
  PublicKey,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import { assureAccountCreated } from "@twamm/client.js/lib/assure-account-created";
import { createTransferNativeTokenInstructions } from "@twamm/client.js";
import { forit } from "a-wait-forit";
import { isNil } from "ramda";
import { Order } from "@twamm/client.js/lib/order";
import { OrderSide } from "@twamm/types/lib";
import { SplToken } from "@twamm/client.js/lib/spl-token";
import { Transfer } from "@twamm/client.js/lib/transfer";

import useProgram from "./use-program";
import useTxRunner from "../contexts/transaction-runner-context";
import { cancelOrder } from "../domain/order";
import { NEXT_PUBLIC_ENABLE_TX_SIMUL } from "../env";

const computePoolCounters = (
  tif: TIF,
  tifs: TIF[],
  poolCounters: PoolCounter[],
  nextPool: boolean
) => {
  const tifIndex = tifs.indexOf(tif);
  if (tifIndex < 0) throw new Error("Invalid TIF");

  const poolCounter = poolCounters[tifIndex];

  const counter: PoolCounter = nextPool
    ? new BN(poolCounter.toNumber() + 1)
    : poolCounter;

  return { currentCounter: poolCounter, targetCounter: counter };
};

export default () => {
  const { program, provider } = useProgram();
  const { commit, setInfo } = useTxRunner();

  const transfer = new Transfer(program, provider);

  const order = new Order(program, provider);

  const TOKEN_PROGRAM_ID = SplToken.getProgramId();

  const run = async function execute({
    aMint,
    amount,
    bMint,
    decimals,
    nextPool,
    poolCounters,
    side,
    tif,
    tifs,
  }: {
    amount: number;
    decimals: number;
    side: OrderSide;
    aMint: string;
    bMint: string;
    tif: TIF;
    nextPool: boolean;
    poolCounters: PoolCounter[];
    tifs: TIF[];
  }) {
    const { currentCounter, targetCounter } = computePoolCounters(
      tif,
      tifs,
      poolCounters,
      nextPool
    );

    const primary = new PublicKey(aMint);
    const secondary = new PublicKey(bMint);

    const transferAccounts = await transfer.findTransferAccounts(
      primary,
      secondary,
      tif,
      currentCounter,
      targetCounter
    );

    // check that similar order exists
    const previousOrderAddress = await order.getKeyByCustodies(
      transferAccounts.aCustody,
      transferAccounts.bCustody,
      tif,
      targetCounter
    );
    const [, previousOrder] = await forit(order.getOrder(previousOrderAddress));

    let preInstructions = [
      await assureAccountCreated(provider, primary, transferAccounts.aWallet),
      await assureAccountCreated(provider, secondary, transferAccounts.bWallet),
    ];

    if (previousOrder) {
      const prevSideStruct = previousOrder.side;
      const hasOppositeSide = Boolean(prevSideStruct[side] === undefined);

      if (hasOppositeSide) {
        const cancelInstruction = await cancelOrder(
          provider,
          program,
          primary,
          secondary,
          previousOrder.lpBalance,
          previousOrderAddress,
          previousOrder.pool
        );

        preInstructions = preInstructions.concat(cancelInstruction);
      }
    }

    const isSell = side === OrderSide.sell;
    const isBuy = side === OrderSide.buy;

    const orderParams = {
      side: isSell ? { sell: {} } : { buy: {} },
      timeInForce: tif,
      amount: new BN(amount * 10 ** decimals),
    };

    if (isSell)
      preInstructions = preInstructions.concat(
        await createTransferNativeTokenInstructions(
          provider,
          primary,
          transferAccounts.aWallet,
          amount
        )
      );

    if (isBuy)
      preInstructions = preInstructions.concat(
        await createTransferNativeTokenInstructions(
          provider,
          secondary,
          transferAccounts.bWallet,
          amount
        )
      );

    const pre = preInstructions.filter(
      (i): i is TransactionInstruction => !isNil(i)
    );

    const accounts = {
      owner: provider.wallet.publicKey,
      userAccountTokenA: transferAccounts.aWallet,
      userAccountTokenB: transferAccounts.bWallet,
      tokenPair: transferAccounts.tokenPair,
      custodyTokenA: transferAccounts.aCustody,
      custodyTokenB: transferAccounts.bCustody,
      order: transferAccounts.targetOrder,
      currentPool: transferAccounts.currentPool,
      targetPool: transferAccounts.targetPool,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    };

    const tx = program.methods
      .placeOrder(orderParams)
      .accounts(accounts)
      .preInstructions(pre);

    if (NEXT_PUBLIC_ENABLE_TX_SIMUL === "1") {
      setInfo("Simulating transaction...");

      const simResult = await tx.simulate().catch((e) => {
        console.error("Failed to simulate", e); // eslint-disable-line no-console
        if (e.simulationResponse?.logs)
          console.error(e.simulationResponse.logs); // eslint-disable-line no-console, max-len
      });

      if (simResult) console.debug(simResult.raw, simResult.events); // eslint-disable-line no-console, max-len
    }

    setInfo("Executing the transaction...");

    const result = await tx.rpc().catch((e: Error) => {
      console.error(e); // eslint-disable-line no-console
      throw e;
    });

    return result;
  };

  return {
    async execute(params: Parameters<typeof run>[0]) {
      const result = await commit(run(params));

      return result;
    },
  };
};
