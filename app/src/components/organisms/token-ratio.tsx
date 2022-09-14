/* eslint-disable */
// TODO: remove ^
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useFormik } from "formik";
import { useCallback, useRef, useState } from "react";

import CoinPopover from "./coin-popover";
import TokenField from "./token-field";
import TokenPairForm from "../molecules/token-pair-form";

export interface Props {
  tokenA: string;
  tokenB: string;
  tokenAValue: number;
  tokenBValue: number;
}

export default function TokenRatio(props: Props) {
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
    <>
      <CoinPopover ref={popoverRef} onChange={onCoinSelect} />
      <Paper elevation={1}>
        <Box p={2}>
          <TokenPairForm
            onASelect={onTokenAChoose}
            onBSelect={onTokenBChoose}
          />
        </Box>
      </Paper>
    </>
  );
}
