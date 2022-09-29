/* eslint-disable */
// TODO: remove ^
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useFormik } from "formik";
import { useCallback, useRef, useState } from "react";

import TokenField from "../atoms/token-field";
import styles from "./token-pair-form.module.css";

export interface Props {
  tokenA?: string;
  tokenB?: string;
  tokenAImage?: string;
  tokenBImage?: string;
  tokenAValue?: number;
  tokenBValue?: number;
  onASelect: () => void;
  onBSelect: () => void;
}

export default ({
  tokenA,
  tokenB,
  tokenAImage,
  tokenBImage,
  onASelect,
  onBSelect,
}: Props) => {
  const popoverRef = useRef<{ isOpened: boolean; open: () => void }>();
  const form = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });

  const [curToken, setCurToken] = useState<number>();

  const onCoinSelect = useCallback(
    (symbol: string) => {
      console.log(curToken, symbol); // eslint-disable-line no-console
    },
    [curToken]
  );

  return (
    <form onSubmit={form.handleSubmit}>
      <Box>
        <TokenField
          alt={tokenA}
          image={tokenAImage}
          label="Pay"
          onClick={onASelect}
        />
      </Box>
      <Box p={2} sx={{ display: "flex", justifyContent: "center" }}>
        <CurrencyExchangeIcon />
      </Box>
      <Box>
        <TokenField
          alt={tokenB}
          image={tokenBImage}
          label="Receive"
          onClick={onBSelect}
        />
      </Box>
      {/*<TextField
        error={Boolean(form.touched.email && form.errors.email)}
        fullWidth
        helperText={form.touched.email && form.errors.email}
        label="Email Address"
        margin="normal"
        name="email"
        onBlur={form.handleBlur}
        onChange={form.handleChange}
        type="email"
        value={form.values.email}
        variant="outlined"
      />*/}
      <Box className={styles.connectBox} sx={{ py: 2 }}>
        <WalletMultiButton
          className={styles.connectWallet}
          disabled={form.isSubmitting}
        />
      </Box>
    </form>
  );
};
