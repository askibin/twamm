import { NATIVE_MINT } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

const NATIVE_TOKEN_ADDRESS = NATIVE_MINT.toBase58();

export { NATIVE_TOKEN_ADDRESS };

export const isNativeTokenAddress = (address: PublicKey) =>
  address.toBase58() === NATIVE_TOKEN_ADDRESS;
