import { createCloseAccountInstruction } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { isNativeTokenAddress } from "./address";

export const createCloseNativeTokenAccountInstruction = async (
  mint: PublicKey,
  destination: PublicKey,
  authority: PublicKey
) => {
  if (!isNativeTokenAddress(mint)) return undefined;

  return createCloseAccountInstruction(destination, authority, authority);
};
