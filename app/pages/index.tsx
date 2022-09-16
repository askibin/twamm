import type { NextPage } from "next";
import Box from "@mui/material/Box";
import Head from "next/head";
import { useCallback, useMemo, useState } from "react";

import Header from "../src/components/organisms/header";
import { modes } from "../src/components/atoms/mode-toggle";
import OfflineOverlay from "../src/components/organisms/offline-overlay";
import Swap from "../src/components/ecosystems/swap";
import TokenPairs from "../src/components/ecosystems/token-pairs";
import styles from "./index.module.css";

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
    if (mode === DEFAULT_MODE)
      return <TokenPairs mode={mode} onModeChange={onModeChange} />;

    return <Swap mode={mode} onModeChange={onModeChange} />;
  }, [mode, onModeChange]);

  return (
    <div className={styles.root}>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width"
        />
        <title>Login | Material Kit</title>
      </Head>
      <OfflineOverlay />
      <Header />
      <Box className={styles.main} component="main" pt={10}>
        {component}
      </Box>
    </div>
  );
};

export default Home;
