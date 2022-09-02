import type { NextPage } from "next";
import AppBar from "@mui/material/AppBar";
import Head from "next/head";
// import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
// import Grid from "@mui/material/Grid";
// import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";

import TokenRatio from "../src/components/organisms/token-ratio";
import Header from "../src/components/organisms/header";

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
      <Header />
      <Box
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
