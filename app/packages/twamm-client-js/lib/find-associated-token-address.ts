import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export const findAssociatedTokenAddress = async (
  wallet: PublicKey,
  mint: PublicKey,
  programId?: PublicKey
) => {
  const [address] = await PublicKey.findProgramAddress(
    [
      wallet.toBuffer(),
      (programId ?? TOKEN_PROGRAM_ID).toBuffer(),
      mint.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  return address;
};
