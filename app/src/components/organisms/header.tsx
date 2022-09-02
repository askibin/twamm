import type { NextPage } from "next";
import Avatar from "@mui/material/Avatar";
import type { FC } from "react";
import AppBar from "@mui/material/AppBar";
import Head from "next/head";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";

import styles from "./header.module.css";

const Header: FC = () => {
  const theme = useTheme();
  const isDesktop = useMemo(() => false, []);

  return (
    <AppBar aria-labelledby="header" position="static">
      <Toolbar
        className={styles.toolbar}
        variant={isDesktop ? "dense" : undefined}
      >
        <Stack direction="row" className={styles.logo}>
          <Avatar className={styles.avatar}>T</Avatar>
          Twap
        </Stack>

        <WalletMultiButton />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
