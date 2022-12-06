import type { Provider } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  createSyncNativeInstruction,
} from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { SplToken } from "./spl-token";

interface WalletProvider extends Provider {
  wallet: { publicKey: PublicKey };
}

export const createTransferNativeTokenInstructions = async (
  provider: Provider,
  mint: PublicKey,
  address: PublicKey,
  uiAmount: number,
  programId: PublicKey = TOKEN_PROGRAM_ID
) => {
  let instructions;
  const { wallet } = provider as WalletProvider;

  if (SplToken.isNativeAddress(mint)) {
    instructions = [
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: address,
        lamports: uiAmount * 1e9,
      }),
      createSyncNativeInstruction(address, programId),
    ];
  }

  return instructions;
};
