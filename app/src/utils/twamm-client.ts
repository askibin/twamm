import type { Address } from "@project-serum/anchor";
import { NATIVE_MINT, createCloseAccountInstruction } from "@solana/spl-token";
import { isNativeToken } from "@twamm/client.js/lib/program";
import { PublicKey } from "@solana/web3.js";
import { translateAddress } from "@project-serum/anchor";

const SOL_ADDRESS = NATIVE_MINT.toBase58();

export const address = (account: Address) => ({
  toString() {
    return translateAddress(account).toBase58();
  },
  toAddress() {
    return translateAddress(account);
  },
});

export class NativeToken {
  public static address = SOL_ADDRESS;

  public static closeAccountInstruction(
    mint: PublicKey,
    tokenAccountAddress: PublicKey,
    walletAddress: PublicKey
  ) {
    let result;

    if (isNativeToken(mint)) {
      result = createCloseAccountInstruction(
        tokenAccountAddress,
        walletAddress,
        walletAddress
      );
    }

    return result;
  }
}
