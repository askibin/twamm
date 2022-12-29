import type { FC, ReactNode } from "react";
import type { AnchorProvider } from "@project-serum/anchor";
import { forit } from "a-wait-forit/lib-ts";
import { isNil } from "ramda";
import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
} from "react";
import storage, { sanidateString, sanidateURL } from "../utils/config-storage";

const EXPLORERS = {
  explorer: { uri: "https://explorer.solana.com/tx" },
  solscan: { uri: "https://solscan.io/tx" },
  solanafm: { uri: "https://solana.fm/tx" },
}; // explorer is default
const FALLBACK_EXPLORER = EXPLORERS.explorer.uri;

const SLIPPAGES = [0, 0.1, 0.5, 1, 2]; // %, 0.5 is default
const FALLBACK_SLIPPAGE = SLIPPAGES[2];

export type TransactionRunnerContext = {
  readonly active: boolean;
  readonly commit: (arg0: Promise<string>) => Promise<string | undefined>;
  readonly error?: Error;
  readonly explorer: string;
  readonly explorers: typeof EXPLORERS;
  readonly info?: string;
  readonly provider?: AnchorProvider;
  readonly setExplorer: (e: string) => void;
  readonly setInfo: (arg0: string) => void;
  readonly setProvider: (p: AnchorProvider) => void;
  readonly setSlippage: (s: number) => void;
  readonly signature?: string;
  readonly slippage: number;
  readonly slippages: typeof SLIPPAGES;
  readonly viewExplorer: (sig: string) => string;
};

const slippageStorage = storage({
  key: "twammSlippage",
  enabled: "twammEnableSlippage",
  sanidate: sanidateString,
});

const explorerStorage = storage({
  key: "twammExplorer",
  enabled: "twammEnableExplorer",
  sanidate: sanidateURL,
});

export const Context = createContext<TransactionRunnerContext | undefined>(
  undefined
);

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const storedSlippage = Number(slippageStorage.get());
  const storedExplorer = String(explorerStorage.get());

  const hasSlippage = useMemo(
    () =>
      Boolean(
        slippageStorage.enabled() &&
          !isNil(storedSlippage) &&
          !Number.isNaN(storedSlippage)
      ),
    [storedSlippage]
  );
  const hasExplorer = useMemo(
    () => Boolean(explorerStorage.enabled() && storedExplorer),
    [storedExplorer]
  );

  const initialSlippage = hasSlippage ? storedSlippage : FALLBACK_SLIPPAGE;
  const initialExplorer = hasExplorer ? storedExplorer : FALLBACK_EXPLORER;

  const [active, setActive] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [explorer, setExplorer] = useState<string>(initialExplorer);
  const [explorers] = useState(EXPLORERS);
  const [info, setInfo] = useState<string>();
  const [provider, setProvider] = useState<AnchorProvider>();
  const [signature, setSignature] = useState<string>();
  const [slippage, setSlippage] = useState<number>(initialSlippage);

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

  const changeSlippage = useCallback(
    (value: number) => {
      const isError = slippageStorage.set(String(value));
      const hasError = isError instanceof Error;

      if (!hasError) {
        setSlippage(value);
      }

      return undefined;
    },
    [setSlippage]
  );

  const changeExplorer = useCallback(
    (value: string) => {
      const isError = explorerStorage.set(value);
      const hasError = isError instanceof Error;

      if (!hasError) {
        setExplorer(value);
      }

      return undefined;
    },
    [setExplorer]
  );

  const viewExplorer = useCallback(
    (sig: string) => new URL(`${explorer}/${sig}`).href,
    [explorer]
  );

  const contextValue = useMemo(
    () => ({
      active,
      commit,
      error,
      explorer,
      explorers,
      info,
      provider,
      setExplorer: changeExplorer,
      setInfo,
      setProvider,
      setSlippage: changeSlippage,
      signature,
      slippages: SLIPPAGES,
      slippage,
      viewExplorer,
    }),
    [
      active,
      changeExplorer,
      changeSlippage,
      commit,
      error,
      explorer,
      explorers,
      info,
      provider,
      setInfo,
      setProvider,
      signature,
      slippage,
      viewExplorer,
    ]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("Transaction runner context required");
  }

  return context;
};
