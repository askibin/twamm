import Box from "@mui/material/Box";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { useCallback, useMemo, useState } from "react";
import { Form } from "react-final-form";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import type { SelectedTif } from "./trade-intervals";
import * as Styled from "./token-pair-form.styled";
import Maybe from "../../types/maybe";
import InTokenField from "./in-token-field";
import TokenSelect from "../atoms/token-select";
import TradeIntervals from "./trade-intervals";
import { useScheduleOrder } from "../../hooks/use-schedule-order";
import { useTIFIntervals } from "../../hooks/use-tif-intervals";

export interface Props {
  onASelect: () => void;
  onBSelect: () => void;
  onABSwap: () => void;
  poolTifs: TMaybe<number[]>;
  poolsCurrent: TMaybe<boolean[]>;
  poolCounters: TMaybe<PoolCounter[]>;
  side: TMaybe<OrderType>;
  tokenA?: string;
  tokenAImage?: string;
  tokenAMint?: string;
  tokenB?: string;
  tokenBImage?: string;
  tokenBMint?: string;
}

const defaultVal = Maybe.withDefault;

export default ({
  onASelect,
  onBSelect,
  onABSwap,
  poolTifs: mbTifs,
  poolsCurrent: mbPoolsCurrent,
  poolCounters: mbPoolCounters,
  side: mbSide,
  tokenA,
  tokenAImage,
  tokenAMint,
  tokenB,
  tokenBImage,
  tokenBMint,
}: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const [tif, setTif] = useState<number>();
  const [isSubmitting, setSubmitting] = useState(false);

  const { execute } = useScheduleOrder();

  const tifs = defaultVal(undefined, mbTifs);
  const currentPoolPresent = defaultVal(undefined, mbPoolsCurrent);
  const poolCounters = defaultVal(undefined, mbPoolCounters);
  const side = defaultVal(undefined, mbSide);

  const intervals = useTIFIntervals({
    aMint: tokenAMint,
    bMint: tokenBMint,
    tifs,
    currentPoolPresent,
    poolCounters,
  });

  const onChangeAmount = useCallback(
    (value: number) => {
      setAmount(value);
    },
    [setAmount]
  );

  const onIntervalSelect = useCallback(
    (selectedTif: SelectedTif) => {
      setTif(selectedTif[0]);
    },
    [setTif]
  );

  const onSubmit = useCallback(async () => {
    // setSubmitting(true);

    console.log("SEND", {
      side,
      amount,
      tokenAMint,
      tokenBMint,
      tifs,
      poolCounters,
      tif,
    });

    /*const r = await execute({
      side,
      amount,
      aMint: tokenAMint,
      bMint: tokenBMint,
      tifs,
      poolCounters,
      tif,
    });*/

    console.log(r);
  }, [
    execute,
    //setSubmitting,
    amount,
    side,
    tif,
    tokenAMint,
    tokenBMint,
    tifs,
    poolCounters,
  ]);

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
            <Styled.OperationButton
              disabled={!tokenA || !tokenB}
              onClick={onABSwap}
            >
              <SyncAltIcon />
            </Styled.OperationButton>
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
          <Box py={2}>
            <TradeIntervals
              intervals={Maybe.of(intervals.data)}
              tifs={schedule}
              value={tif}
              onSelect={onIntervalSelect}
            />
          </Box>
          <Styled.ConnectBox py={3}>
            <Styled.ConnectButton type="submit" disabled={isSubmitting}>
              Schedule
            </Styled.ConnectButton>
          </Styled.ConnectBox>
        </form>
      )}
    </Form>
  );
};
