/* eslint-disable */
// TODO: remove ^
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useFormik } from "formik";
import { useCallback, useRef, useState } from "react";

import TokenField from "../organisms/token-field";
import styles from "./token-pair-form.module.css";

export interface Props {
  tokenA: string;
  tokenB: string;
  tokenAValue: number;
  tokenBValue: number;
}

export default (props: Props) => {
  const popoverRef = useRef<{ isOpened: boolean; open: () => void }>();
  const form = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });

  const [curToken, setCurToken] = useState<number>();

  const onTokenAChoose = useCallback(() => {
    console.log(props); // eslint-disable-line no-console

    setCurToken(1);
    if (!popoverRef.current?.isOpened) popoverRef.current?.open();
  }, [popoverRef, setCurToken]);

  const onTokenBChoose = useCallback(() => {
    console.log(props); // eslint-disable-line no-console

    setCurToken(2);
    if (!popoverRef.current?.isOpened) popoverRef.current?.open();
  }, [popoverRef, setCurToken]);

  const onCoinSelect = useCallback(
    (symbol: string) => {
      console.log(curToken, symbol); // eslint-disable-line no-console
    },
    [curToken]
  );

  return (
    <form onSubmit={form.handleSubmit}>
      <Box sx={{ my: 3 }}>
        <Typography color="textPrimary" variant="h4">
          Sign in
        </Typography>
        <Typography color="textSecondary" gutterBottom variant="body2">
          Sign in on the internal platform
        </Typography>
      </Box>
      <TokenField onClick={onTokenAChoose} />
      <TokenField onClick={onTokenBChoose} />
      <TextField
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
      />
      <Box className={styles.connectBox} sx={{ py: 2 }}>
        <WalletMultiButton
          className={styles.connectWallet}
          disabled={form.isSubmitting}
        />
      </Box>
    </form>
  );
}
