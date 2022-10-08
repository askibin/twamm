import type { TransactionInstruction } from "@solana/web3.js";
import type { FC, ReactNode } from "react";
import type { AnchorProvider } from "@project-serum/anchor";
import { Transaction } from "@solana/web3.js";
import { createContext, useMemo, useCallback, useState } from "react";

export type TransactionRunnerContext = {
  readonly active: boolean;
  readonly commit: (ti: TransactionInstruction[]) => Promise<string>;
  readonly setProvider: (p: AnchorProvider) => void;
};

export const RunnerContext = createContext<
  TransactionRunnerContext | undefined
>(undefined);

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [active, setActive] = useState<boolean>(false);
  const [provider, setProvider] = useState<AnchorProvider>();

  const commit = useCallback(
    async (ti: TransactionInstruction[]) => {
      if (!provider) {
        throw new Error("Can not run the transaction. Absent provider");
      }

      if (!active) setActive(true);

      const tx = new Transaction().add(...ti);

      const signatures = await provider.sendAll([{ tx }]);

      setActive(false);

      return signatures[0];
    },
    [active, provider, setActive]
  );

  const contextValue = useMemo(
    () => ({ active, commit, setProvider }),
    [active, commit, setProvider]
  );

  return (
    <RunnerContext.Provider value={contextValue}>
      {children}
    </RunnerContext.Provider>
  );
};
