/* eslint-disable */
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import * as Token from "@solana/spl-token";

const DECIMALS = 9;

export const sellWrappedSolInstructions = (
  from: PublicKey,
  to: PublicKey,
  uiAmount: number
) => {
  //const instructions =
};
