import type { Address, AccountNamespace } from "@project-serum/anchor";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  TOKEN_PROGRAM_ID,
  createCloseAccountInstruction,
} from "@solana/spl-token";
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

export const findAssociatedTokenAddress = async (
  walletAddress: PublicKey,
  mintAddress: PublicKey
) => {
  const [addr] = await PublicKey.findProgramAddress(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mintAddress.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  return addr;
};

export class NativeToken {
  public static address = SOL_ADDRESS;

  public static isNative(addr: PublicKey) {
    return addr.toBase58() === SOL_ADDRESS;
  }

  public static closeAccountInstruction(
    mint: PublicKey,
    tokenAccountAddress: PublicKey,
    walletAddress: PublicKey
  ) {
    let result;

    if (NativeToken.isNative(mint)) {
      result = createCloseAccountInstruction(
        tokenAccountAddress,
        walletAddress,
        walletAddress
      );
    }

    return result;
  }
}

export const poolClient = (account: AccountNamespace) => ({
  async getPool(addr: PublicKey) {
    const a: unknown = account.pool.fetch(addr);

    return a as PoolData;
  },
});

export const tokenPairClient = (account: AccountNamespace) => ({
  async getTokenPair(addr: PublicKey) {
    const a: unknown = account.tokenPair.fetch(addr);

    return a as TokenPairProgramData;
  },
});
