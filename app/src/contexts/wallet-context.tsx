import type { FC, ReactNode } from "react";
import type { WalletError } from "@solana/wallet-adapter-base";
import { useCallback, useMemo } from "react";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletProvider as Provider } from "@solana/wallet-adapter-react";

import { useSnackbar } from "./notification-context";

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new LedgerWalletAdapter()],
    []
  );

  const onError = useCallback(
    (error: WalletError) => {
      enqueueSnackbar(error.message || error.name, {
        variant: "error",
      });
    },
    [enqueueSnackbar]
  );

  return (
    <Provider wallets={wallets} onError={onError} autoConnect>
      <WalletModalProvider>{children}</WalletModalProvider>
    </Provider>
  );
};
