import type { BN, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

import { findAddress } from "./program";

export class Pool {
  transferAuthority: PublicKey;

  init = async (program: Program, tokenAMint: PublicKey, tokenBMint: PublicKey) => {
    const findProgramAddress = findAddress(program);

    this.transferAuthority = await findProgramAddress(
      "transfer_authority",
      []
    );

  }
}

export const getPoolKey = async (tif: number, poolCounter: BN) => {
    let tifBuf = Buffer.alloc(4);
    tifBuf.writeUInt32LE(tif, 0);

    let counterBuf = Buffer.alloc(8);
    counterBuf.writeBigUInt64LE(BigInt(poolCounter.toString()), 0);

    return this.findProgramAddress("pool", [
      this.tokenACustody.toBuffer(),
      this.tokenBCustody.toBuffer(),
      tifBuf,
      counterBuf,
    ]);
  };

export const getPool = async (tif: number, poolCounter: BN) => {
    return this.program.account.pool.fetch(
      await this.getPoolKey(tif, poolCounter)
    );
  };
