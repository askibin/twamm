import { useWallet } from "@solana/wallet-adapter-react";
import { getProvider, getProgram } from "../contexts/twamm-program-context";

// eslint-disable-next-line import/prefer-default-export
export const useProgram = () => {
  const wallet = useWallet();

  const program = getProgram(wallet);
  const provider = getProvider(wallet);

  return { program, provider };
};
