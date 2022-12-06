import type { Provider } from "@project-serum/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";

// TODO: improve types as those for this helper are not exported
const createAssociatedTokenAccountInstruction = (
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): TransactionInstruction => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedToken, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data: Buffer.alloc(0),
  });
};

interface WalletProvider extends Provider {
  wallet: { publicKey: PublicKey };
}

export const assureAccountCreated = async (
  provider: WalletProvider,
  mint: PublicKey,
  address: PublicKey,
  programId?: PublicKey
) => {
  const { wallet } = provider;

  if (!wallet) throw new Error("Absent wallet");

  try {
    const accountInfo = await provider.connection.getAccountInfo(address);

    if (!accountInfo) {
      throw new Error("TokenAccountNotFoundError");
    }
  } catch (err: any) {
    if (!err?.message.startsWith("TokenAccountNotFoundError")) {
      throw new Error("Unexpected error in getAccountInfo");
    }

    return createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      address,
      wallet.publicKey,
      mint,
      programId
    );
  }

  return undefined;
};
