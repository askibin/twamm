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
  uiAmount: number
) => {
  let instructions;
  const { wallet } = provider as WalletProvider;

  if (mint.toBase58() === SOL_ADDRESS) {
    instructions = [
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: address,
        lamports: uiAmount * 1e9,
      }),
      createSyncNativeInstruction(address, TOKEN_PROGRAM_ID),
    ];
  }

  return instructions;
};
