import { useContext } from "react";
import { RunnerContext } from "../contexts/transaction-runner-context";

export const useTxRunnerContext = () => {
  const context = useContext(RunnerContext);
  if (context === undefined) {
    throw new Error("Transaction runner context required");
  }

  return context;
};
