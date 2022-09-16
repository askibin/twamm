import type { Commitment } from "@solana/web3.js";
import type { Idl, Wallet } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

import { Program, AnchorProvider as Provider } from "@project-serum/anchor";

import idl from "../idl.json";

export { idl };

const opts: { preflightCommitment: Commitment } = {
  preflightCommitment: "processed",
};
const programId = new PublicKey(idl.metadata.address);

export const getProvider = async (wallet: Wallet) => {
  const network = "http://127.0.0.1:8899";
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(connection, wallet, {
    preflightCommitment: opts.preflightCommitment,
  });

  return provider;
};

export const getProgram = async (wallet: Wallet) => {
  const provider = await getProvider(wallet);

  const program = new Program(idl as Idl, programId, provider);

  return program;
};
