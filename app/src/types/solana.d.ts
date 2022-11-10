import type {
  PublicKey,
  Signer,
  TransactionInstruction,
} from "@solana/web3.js";

// enhance typings to cover actual helper
declare module "@solana/spl-token" {
  function createSyncNativeInstruction(
    account: PublicKey,
    programId?: PublicKey
  ): TransactionInstruction;

  function createCloseAccountInstruction(
    account: PublicKey,
    destination: PublicKey,
    authority: PublicKey,
    multiSigners?: Signer[],
    programId?: PublicKey
  ): TransactionInstruction;
}
