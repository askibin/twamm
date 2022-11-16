import type { Provider } from "@project-serum/anchor";
import {
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  createSyncNativeInstruction,
} from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";

const SOL_ADDRESS = NATIVE_MINT.toBase58();

interface WalletProvider extends Provider {
  wallet: { publicKey: PublicKey };
}

export const createTransferNativeTokenInstructions = async (
  provider: Provider,
  mint: PublicKey,
  address: PublicKey,
  side: "sell" | "buy",
  uiAmount: number
) => {
  const instructions = [];
  const { wallet } = provider as WalletProvider;

  if (side === "sell" && mint.toBase58() === SOL_ADDRESS) {
    instructions.push(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: address,
        lamports: uiAmount * 1e9,
      })
    );
    instructions.push(createSyncNativeInstruction(address, TOKEN_PROGRAM_ID));
    return instructions;
  }

  if (side === "buy" && mint.toBase58() === SOL_ADDRESS) {
    instructions.push(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: address,
        lamports: uiAmount * 1e9,
      })
    );

    instructions.push(createSyncNativeInstruction(address, TOKEN_PROGRAM_ID));

    return instructions;
  }

  return undefined;
};
