import type { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Pool } from "./pool";

export class TokenPair {
  program: Program;

  pool: Pool;

  constructor(program: Program) {
    this.program = program;
    this.pool = new Pool(program);
  }

  getPair = async (address: PublicKey) => {
    const p = this.program.account.tokenPair.fetch(address);

    return p;
  };

  getPairByPoolAddress = async (address: PublicKey) => {
    const pool = (await this.pool.getPool(address)) as { tokenPair: PublicKey };
    const pair = await this.program.account.tokenPair.fetch(pool.tokenPair);

    return pair;
  };
}