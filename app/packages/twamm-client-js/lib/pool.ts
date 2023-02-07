/* eslint-disable max-classes-per-file */
import type { BN, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

import { fetchMultipleAddresses } from "./utils";
import { findAddress } from "./program";
import { getAssocTokenAddress } from "./address";

export class Pool {
  program: Program;

  constructor(program: Program) {
    this.program = program;
  }

  getPool = async (address: PublicKey) => {
    const p = this.program.account.pool.fetch(address);

    return p;
  };

  getPools = async (addresses: PublicKey[]) => {
    const all = await fetchMultipleAddresses(
      this.program.account.pool.fetchMultiple.bind(this.program.account.pool),
      addresses
    );

    return all;
  };

  // FEAT: to consider using PoolAuthority.getKey to replace custodies usage with mints
  getAddressByCustodiesAndTIF = async (
    aCustody: PublicKey,
    bCustody: PublicKey,
    tif: number,
    poolCounter: BN
  ) => {
    console.warn("DEPRECATED");

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

    if (!this.transferAuthority)
      throw new Error("Transfer authority is absent");

    const tokenACustody = await getAssocTokenAddress(
      this.tokenAMint,
      this.transferAuthority
    );

    const tokenBCustody = await getAssocTokenAddress(
      this.tokenBMint,
      this.transferAuthority
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
