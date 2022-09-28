import { useContext } from "react";
import { BlockchainConnectionContext } from "../contexts/solana-connection-context";

export const useBlockchainConnectionContext = () => {
  const context = useContext(BlockchainConnectionContext);
  if (context === undefined) {
    throw new Error("Solana connection context required");
  }

  return context;
};
