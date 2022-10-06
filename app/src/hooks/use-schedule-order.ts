import { BN } from "@project-serum/anchor";
import { SystemProgram } from "@solana/web3.js";
import {
  createSyncNativeInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import { forit } from "../utils/forit";
import { useProgram } from "./use-program";

const SOL_ADDRESS = "So11111111111111111111111111111111111111112";

export const useScheduleOrder = () => {
  const { program, provider } = useProgram();

  async function execute({
    amount,
    side,
    aMint,
    bMint,
    tif,
    nextPool,
    tifs,
    poolCounters,
  }: {
    amount: number;
    side: "sell" | "buy";
    aMint: string;
    bMint: string;
    tif: number;
    nextPool?: number;
  }) {
    console.log(program, amount, tif, aMint, bMint, nextPool);

    let pre = [];

    if (side === "sell" && aMint === SOL_ADDRESS) {
      pre.push(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: aWallet,
          lamports: amount,
        })
      );
      pre.push(createSyncNativeInstruction(aWallet));
    }

    if (side === "buy" && bMint == SOL_ADDRESS) {
      pre.push(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: bWallet,
          lamports: amount,
        })
      );

      pre.push(createSyncNativeInstruction(bWallet));
    }

    const index = tifs.indexOf(tif);
    if (index < 0) throw new Error("Invalid TIF");
    const counter = poolCounters[index];

    const result = await forit(
      program.methods
        .placeOrder({
          side: side === "sell" ? { sell: {} } : { buy: {} },
          timeInForce: tif,
          amount: new BN(amount),
        })
        .preInstructions(pre)
        .rpc()
    );

    console.log("res", result);

    return result;
  }

  return { execute };
};
