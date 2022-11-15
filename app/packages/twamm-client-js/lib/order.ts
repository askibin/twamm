import type { BN, Program, Provider } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import { encode } from "bs58";

import { findAddress } from "./program";
import { getAccountDiscriminator } from "./account";
import { Pool } from "./pool";

interface WalletProvider extends Provider {
  wallet: { publicKey: PublicKey };
}

export class Order {
  program: Program;

  provider: Provider;

  constructor(program: Program, provider: Provider) {
    this.program = program;
    this.provider = provider;
  }

  async getKeyByCustodies(
    aCustody: PublicKey,
    bCustody: PublicKey,
    tif: number,
    poolCounter: BN
  ) {
    const pool = new Pool(this.program);
    const poolKey = await pool.getKeyByCustodies(
      aCustody,
      bCustody,
      tif,
      poolCounter
    );

    const { wallet } = this.provider as WalletProvider;

    if (!wallet) throw new Error("Absent wallet");

    return findAddress(this.program)("order", [
      wallet.publicKey.toBuffer(),
      poolKey.toBuffer(),
    ]);
  }

  getOrders = async (account: PublicKey | null) => {
    const discriminator = getAccountDiscriminator("Order");

    const data = !account
      ? [discriminator]
      : [discriminator, account.toBuffer()];

    const bytes = encode(Buffer.concat(data));

    const filters = [{ dataSize: 128 }, { memcmp: { bytes, offset: 0 } }];

    const orders = await this.provider.connection.getProgramAccounts(
      this.program.programId,
      { filters }
    );

    const all = await Promise.all(
      orders.map((order: { pubkey: PublicKey }) =>
        this.program.account.order.fetch(order.pubkey)
      )
    );

    return all;
  };
}
