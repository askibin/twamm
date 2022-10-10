import type { SWRResponse } from "swr";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { useCallback, useMemo, useState } from "react";
import { Form } from "react-final-form";

import * as Styled from "./token-pair-form.styled";
import InTokenField from "./in-token-field";
import styles from "./token-pair-form.module.css";
import TokenSelect from "../atoms/token-select";
import TradeIntervals from "./trade-intervals";
import { useScheduleOrder } from "../../hooks/use-schedule-order";
import { useTIFIntervals } from "../../hooks/use-tif-intervals";

export interface Props {
  tokenA?: string;
  tokenB?: string;
  tokenAImage?: string;
  tokenBImage?: string;
  tokenAMint?: string;
  tokenBMint?: string;
  onASelect: () => void;
  onBSelect: () => void;
  tokenPair: SWRResponse<{ tifs: number[] }>;
}

export default ({
  tokenA,
  tokenB,
  tokenAImage,
  tokenBImage,
  tokenAMint,
  tokenBMint,
  onASelect,
  onBSelect,
  tokenPair,
}: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const [tif, setTif] = useState<number>();
  const [isSubmitting, setSubmitting] = useState(false);

  const { execute } = useScheduleOrder();

  const intervals = useTIFIntervals({
    aMint: tokenAMint,
    bMint: tokenBMint,
    tifs: tokenPair.data?.tifs,
    currentPoolPresent: tokenPair.data?.currentPoolPresent,
    poolCounters: tokenPair.data?.poolCounters,
  });

  const onChangeAmount = useCallback(
    (value) => {
      setAmount(value);
    },
    [setAmount]
  );

  const onIntervalSelect = useCallback(
    (selectedTif) => {
      console.log("state", selectedTif);
      setTif(selectedTif);
    },
    [setTif]
  );

  const onSubmit = useCallback(async () => {
    // setSubmitting(true);

    console.log("SEND", tif, amount);

    const r = await execute({
      side: "sell",
      amount: amount,
      aMint: tokenAMint,
      bMint: tokenBMint,
      tifs: tokenPair.data.tifs,
      poolCounters: tokenPair.data.poolCounters,
      tif,
    });

    console.log(r);
  }, [
    execute,
    setSubmitting,
    amount,
    tif,
    tokenAMint,
    tokenBMint,
    tokenPair.data,
  ]);

  const { tifs } = tokenPair.data ?? { tifs: undefined };

  const schedule = useMemo(() => {
    if (!tifs) return undefined;

    let intervals = tifs.filter((tif) => tif !== 0);
    return intervals;
  }, [tifs]);

  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Styled.TokenLabelBox>You pay</Styled.TokenLabelBox>
          <InTokenField
            name={tokenA}
            onChange={onChangeAmount}
            src={tokenAImage}
            onSelect={onASelect}
          />
          <Styled.OperationImage>
            <SyncAltIcon />
          </Styled.OperationImage>
          <Styled.TokenLabelBox>You receive</Styled.TokenLabelBox>
          <Box pb={2}>
            <TokenSelect
              alt={tokenB}
              disabled={!tokenA}
              image={tokenBImage}
              label={tokenB}
              onClick={onBSelect}
            />
          </Box>
          <TradeIntervals
            tifs={tokenPair.data?.tifs}
            intervals={intervals}
            tifs={schedule}
            value={tif}
            onSelect={onIntervalSelect}
          />
          <Box className={styles.connectBox} sx={{ py: 2 }}>
            <Button
              type="submit"
              className={styles.connectWallet}
              disabled={isSubmitting}
            >
              Schedule
            </Button>
          </Box>
        </form>
      )}
    </Form>
  );
};
