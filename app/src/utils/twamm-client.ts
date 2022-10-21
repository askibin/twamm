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
