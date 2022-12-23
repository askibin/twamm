import type { FC, ReactNode } from "react";
import type { AnchorProvider } from "@project-serum/anchor";
import { forit } from "a-wait-forit/lib-ts";
import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
} from "react";

const EXPLORERS = {
  explorer: { uri: "https://explorer.solana.com/tx/" },
  solscan: { uri: "https://solscan.io/tx/" },
};

const SLIPPAGES = [0, 0.1, 0.5, 1, 2]; // %

export type TransactionRunnerContext = {
  readonly active: boolean;
  readonly commit: (arg0: Promise<string>) => Promise<string | undefined>;
  readonly error?: Error;
  readonly explorer: string;
  readonly explorers: typeof EXPLORERS;
  readonly provider?: AnchorProvider;
  readonly setExplorer: (e: string) => void;
  readonly setProvider: (p: AnchorProvider) => void;
  readonly setSlippage: (s: number) => void;
  readonly signature?: string;
  readonly slippage: number;
  readonly slippages: typeof SLIPPAGES;
  readonly viewExplorer: (sig: string) => string;
};

export const RunnerContext = createContext<
  TransactionRunnerContext | undefined
>(undefined);

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [active, setActive] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [explorer, setExplorer] = useState<string>(EXPLORERS.explorer.uri);
  const [provider, setProvider] = useState<AnchorProvider>();
  const [signature, setSignature] = useState<string>();
  const [slippage, setSlippage] = useState<number>(SLIPPAGES[3]);

  const commit = useCallback(
    async (operation: Parameters<TransactionRunnerContext["commit"]>[0]) => {
      setSignature(undefined);
      setError(undefined);

      if (!active) setActive(true);

      const [err, signatures] = await forit(operation);

      if (signatures) {
        setActive(false);
        setSignature(signatures);

        return signatures;
      }

      if (err) {
        setActive(false);
        setError(err);
      }

      return undefined;
    },
    [active, setActive]
  );

  const viewExplorer = useCallback(
    (sig: string) => `${explorer}${sig}`,
    [explorer]
  );

  const contextValue = useMemo(
    () => ({
      active,
      commit,
      error,
      explorer,
      explorers: EXPLORERS,
      provider,
      setExplorer,
      setProvider,
      setSlippage,
      signature,
      slippages: SLIPPAGES,
      slippage,
      viewExplorer,
    }),
    [
      active,
      commit,
      error,
      explorer,
      provider,
      setExplorer,
      setProvider,
      setSlippage,
      signature,
      slippage,
      viewExplorer,
    ]
  );

  return (
    <RunnerContext.Provider value={contextValue}>
      {children}
    </RunnerContext.Provider>
  );
};

export default () => {
  const context = useContext(RunnerContext);
  if (context === undefined) {
    throw new Error("Transaction runner context required");
  }

  return context;
};
