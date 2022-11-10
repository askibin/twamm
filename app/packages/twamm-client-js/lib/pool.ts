/* eslint-disable max-classes-per-file */
import type { BN, Program } from "@project-serum/anchor";
// TODO: make a PR to resolve the type
// @ts-ignore
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import { findAddress } from "./program";

export class Pool {
  program: Program;

  constructor(program: Program) {
    this.program = program;
  }

  getPool = async (address: PublicKey) => {
    const p = this.program.account.pool.fetch(address);

    return p;
  };

  getKeyByCustodies = async (
    aCustody: PublicKey,
    bCustody: PublicKey,
    tif: number,
    poolCounter: BN
  ) => {
    const tifBuf = Buffer.alloc(4);
    tifBuf.writeUInt32LE(tif, 0);

    const counterBuf = Buffer.alloc(8);
    counterBuf.writeBigUInt64LE(BigInt(poolCounter.toString()), 0);

    return findAddress(this.program)("pool", [
      aCustody.toBuffer(),
      bCustody.toBuffer(),
      tifBuf,
      counterBuf,
    ]);
  };
}

export class PoolAuthority {
  program: Program;

  tokenAMint: PublicKey;

  tokenBMint: PublicKey;

  transferAuthority?: PublicKey;

  constructor(program: Program, aMint: PublicKey, bMint: PublicKey) {
    this.program = program;
    this.tokenAMint = aMint;
    this.tokenBMint = bMint;
    this.transferAuthority = undefined;
  }

  init = async () => {
    const findProgramAddress = findAddress(this.program);

    this.transferAuthority = await findProgramAddress("transfer_authority", []);
  };

  getKey = async (tif: number, poolCounter: BN) => {
    const tifBuf = Buffer.alloc(4);
    tifBuf.writeUInt32LE(tif, 0);

    const counterBuf = Buffer.alloc(8);
    counterBuf.writeBigUInt64LE(BigInt(poolCounter.toString()), 0);

    const tokenACustody = await getAssociatedTokenAddress(
      this.tokenAMint,
      this.transferAuthority,
      true
    );

    const tokenBCustody = await getAssociatedTokenAddress(
      this.tokenBMint,
      this.transferAuthority,
      true
    );

    return findAddress(this.program)("pool", [
      tokenACustody.toBuffer(),
      tokenBCustody.toBuffer(),
      tifBuf,
      counterBuf,
    ]);
  };

  getPoolByTIF = async (tif: number, poolCounter: BN) => {
    const key = await this.getKey(tif, poolCounter);

    return this.program.account.pool.fetch(key);
  };
}
