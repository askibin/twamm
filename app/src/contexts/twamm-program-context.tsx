import type { Commitment } from "@solana/web3.js";
import { Connection, PublicKey } from "@solana/web3.js";

import {
  Program,
  AnchorProvider as Provider,
  web3,
} from "@project-serum/anchor";

import idl from "../idl.json";

export { idl };

const opts: { preflightCommitment: Commitment } = {
  preflightCommitment: "processed",
};
const programId = new PublicKey(idl.metadata.address);

export const getProvider = async (wallet) => {
  const network = "http://127.0.0.1:8899";
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(connection, wallet, opts.preflightCommitment);

  return provider;
};

export const getProgram = async (wallet) => {
  const provider = await getProvider(wallet);

  const program = new Program(idl, programId, provider);

  return program;
};
