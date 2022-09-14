import type { NextPage } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Head from "next/head";

import TokenRatio from "../src/components/organisms/token-ratio";
import Header from "../src/components/organisms/header";
import OfflineOverlay from "../src/components/organisms/offline-overlay";
import styles from "./index.module.css";

const Home: NextPage = () => {
  const { data } = {
    data: {
      tokenA: "RAY",
      tokenB: "SOL",
      tokenAValue: 1,
      tokenBValue: 1,
    },
  };

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
      <Box
        className={styles.main}
        component="main"
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth="sm">
          <TokenRatio
            tokenA={data.tokenA}
            tokenB={data.tokenB}
            tokenAValue={data.tokenAValue}
            tokenBValue={data.tokenBValue}
          />
        </Container>
      </Box>
    </div>
  );
};

export default Home;
