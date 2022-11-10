import type { Program, Provider } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import { encode } from "bs58";

import { getAccountDiscriminator } from "./account";

export class Order {
  program: Program;

  provider: Provider;

  constructor(program: Program, provider: Provider) {
    this.program = program;
    this.provider = provider;
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
