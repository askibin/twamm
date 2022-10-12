import type { PublicKey, TransactionInstruction } from "@solana/web3.js";

// enhance typings to cover actual helper
declare module "@solana/spl-token" {
  function createSyncNativeInstruction(
    programId: PublicKey,
    nativeAccount: PublicKey
  ): TransactionInstruction;
}
