import type { PublicKey } from "@solana/web3.js";
import type { Wallet } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";

import { getProvider, getProgram } from "../contexts/twamm-program-context";

export const useProgram = () => {
  const wallet: { publicKey: PublicKey | null } = useWallet();

  if (!wallet.publicKey) {
    throw new Error("Can not initialize program. Absent wallet");
  }

  const program = getProgram(wallet as Wallet);
  const provider = getProvider(wallet as Wallet);

  return { program, provider };
};
