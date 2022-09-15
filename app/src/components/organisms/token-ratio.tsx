/* eslint-disable */
// TODO: remove ^
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useFormik } from "formik";
import { useCallback, useRef, useState } from "react";

import CoinPopover from "./coin-popover";
import TokenPairForm from "../molecules/token-pair-form";
import styles from "./token-ratio.module.css";
import { useCoinData } from "../../hooks/use-coin-data";

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

  const initialTokenB = useCoinData({ id: "solana" });
  const initialTokenA = useCoinData({ id: "usd-coin" });

  return (
    <>
      <CoinPopover ref={popoverRef} onChange={onCoinSelect} />
      <Paper className={styles.tokenPair} elevation={1}>
        <Box p={2}>
          <TokenPairForm
            onASelect={onTokenAChoose}
            onBSelect={onTokenBChoose}
            tokenA={initialTokenA.data?.symbol}
            tokenAImage={initialTokenA.data?.image.small}
            tokenB={initialTokenB.data?.symbol}
            tokenBImage={initialTokenB.data?.image.small}
          />
        </Box>
      </Paper>
    </>
  );
}
