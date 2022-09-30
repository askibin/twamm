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

  getOrders = async (account: PublicKey) => {
    const data = encode(
      Buffer.concat([getAccountDiscriminator("Order"), account.toBuffer()])
    );

    const orders = await this.provider.connection.getProgramAccounts(
      this.program.programId,
      {
        filters: [{ dataSize: 128 }, { memcmp: { bytes: data, offset: 0 } }],
      }
    );

    return Promise.all(
      orders.map((order: { pubkey: PublicKey }) =>
        this.program.account.order.fetch(order.pubkey)
      )
    );
  };
}
