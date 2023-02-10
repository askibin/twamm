import type { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

import { Pool } from "./pool";
import { findAddress } from "./program";
import { fetchMultipleAddresses } from "./utils";

export class TokenPair {
  readonly pool: Pool;

  readonly program: Program;

  constructor(program: Program) {
    this.program = program;
    this.pool = new Pool(program);
  }

  getPair = async (address: PublicKey) => {
    const p = this.program.account.tokenPair.fetch(address);

    return p;
  };

  getPairByPairAddresses = async (addressPair: [PublicKey, PublicKey]) => {
    const bufferPair = [addressPair[0].toBuffer(), addressPair[1].toBuffer()];

    const address = await findAddress(this.program)("token_pair", bufferPair);

    return this.getPair(address);
  };

  getPairs = async (addresses: PublicKey[]) => {
    const all = await fetchMultipleAddresses(
      this.program.account.tokenPair.fetchMultiple.bind(
        this.program.account.tokenPair
      ),
      addresses
    );

    return all;
  };

  getPairByPoolAddress = async (address: PublicKey) => {
    const pool = (await this.pool.getPool(address)) as { tokenPair: PublicKey };
    const pair = await this.getPair(pool.tokenPair);

    return pair;
  };
}
