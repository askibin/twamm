import type { Address, AccountNamespace } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import { translateAddress } from "@project-serum/anchor";

export const address = (account: Address) => ({
  toString() {
    return translateAddress(account).toBase58();
  },
  toAddress() {
    return translateAddress(account);
  },
});

export const poolClient = (account: AccountNamespace) => ({
  async getPool(addr: PublicKey) {
    return account.pool.fetch(addr);
  },
});

export const tokenPairClient = (account: AccountNamespace) => ({
  async getTokenPair(addr: PublicKey) {
    return account.tokenPair.fetch(addr);
  },
});
