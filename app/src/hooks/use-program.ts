import type { Wallet } from "@project-serum/anchor";
import { Program, AnchorProvider as Provider } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { programId, idl } from "../env";
import { useBlockchainConnectionContext } from "./use-blockchain-connection-context";

export const useProgram = () => {
  const { commitment, createConnection } = useBlockchainConnectionContext();
  const wallet = useWallet();

  if (!programId) {
    throw new Error("Can not start. Absent program address");
  }

  const currentWallet: unknown = wallet;

  const preflightCommitment = { preflightCommitment: commitment };

  const connection = createConnection(commitment);

  const provider = new Provider(
    connection,
    currentWallet as Wallet,
    preflightCommitment
  );

  const program = new Program(idl, new PublicKey(programId), provider);

  return { program, provider };
};
