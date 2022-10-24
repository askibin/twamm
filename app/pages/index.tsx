import type { NextPage } from "next";
import Box from "@mui/material/Box";
import Head from "next/head";
import { SWRConfig } from "swr";
import { useCallback, useMemo, useState } from "react";

import Header from "../src/components/organisms/header";
import OfflineOverlay from "../src/components/organisms/offline-overlay";
import Orders from "../src/components/ecosystems/orders";
import styles from "./index.module.css";
import Swap from "../src/components/ecosystems/swap";
import swrConfig from "../src/swr-options";
import TokenPairs from "../src/components/ecosystems/token-pairs";
import WalletGuard from "../src/components/organisms/wallet-guard";
import { modes } from "../src/components/atoms/mode-toggle";

//const DEFAULT_MODE = modes.get("swap") as string;
const DEFAULT_MODE = modes.get("pools") as string;
const Home: NextPage = () => {
  const [mode, setMode] = useState<string>(DEFAULT_MODE);

  const onModeChange = useCallback(
    (nextMode: string) => {
      setMode(nextMode);
    },
    [setMode]
  );

  const component = useMemo(() => {
    if (mode === modes.get("pools"))
      return <TokenPairs mode={mode} onModeChange={onModeChange} />;

    if (mode === modes.get("orders"))
      return (
        <WalletGuard>
          <Orders mode={mode} onModeChange={onModeChange} />
        </WalletGuard>
      );

    if (mode === modes.get("swap"))
      return (
        <WalletGuard>
          <Swap mode={mode} onModeChange={onModeChange} />
        </WalletGuard>
      );

    return null;
  }, [mode, onModeChange]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width"
        />
        <title>Twamm</title>
      </Head>
      <div className={styles.root}>
        <SWRConfig value={swrConfig}>
          <OfflineOverlay />
          <Header />
          <Box className={styles.main} component="main" pt={10}>
            {component}
          </Box>
        </SWRConfig>
      </div>
    </>
  );
};

export default Home;
