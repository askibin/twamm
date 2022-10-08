import type { TransactionInstruction } from "@solana/web3.js";
import type { FC, ReactNode } from "react";
import type { AnchorProvider } from "@project-serum/anchor";
import { Transaction } from "@solana/web3.js";
import { createContext, useMemo, useCallback, useState } from "react";

export type TransactionRunnerContext = {
  readonly active: boolean;
  readonly commit: (ti: TransactionInstruction[]) => Promise<string>;
  readonly setProvider: (p: AnchorProvider) => void;
  readonly signature?: string;
  readonly viewExplorer: (sig: string) => string;
};

export const RunnerContext = createContext<
  TransactionRunnerContext | undefined
>(undefined);

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [active, setActive] = useState<boolean>(false);
  const [provider, setProvider] = useState<AnchorProvider>();
  const [signature, setSignature] = useState<string | undefined>();

  const commit = useCallback(
    async (ti: TransactionInstruction[]) => {
      if (!provider) {
        throw new Error("Can not run the transaction. Absent provider");
      }
      setSignature(undefined);

      if (!active) setActive(true);

      const tx = new Transaction().add(...ti);

      const signatures = await provider.sendAll([{ tx }]);

      setActive(false);
      setSignature(signatures[0]);

      return signatures[0];
    },
    [active, provider, setActive]
  );

  const viewExplorer = useCallback(
    (sig: string) => `https://solscan.io/tx/${sig}`,
    []
  );

  const contextValue = useMemo(
    () => ({ active, commit, setProvider, signature, viewExplorer }),
    [active, commit, setProvider, signature, viewExplorer]
  );

  return (
    <RunnerContext.Provider value={contextValue}>
      {children}
    </RunnerContext.Provider>
  );
};
