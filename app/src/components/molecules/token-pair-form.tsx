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
  tokenADecimals?: number;
  tokenAImage?: string;
  tokenAMint?: string;
  tokenB?: string;
  tokenBImage?: string;
  tokenBMint?: string;
}

type ValidationErrors = { a?: Error; b?: Error; amount?: Error };

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
  tokenADecimals,
  tokenAImage,
  tokenAMint,
  tokenB,
  tokenBImage,
  tokenBMint,
}: Props) => {
  const { execute } = useScheduleOrder();

  const [amount, setAmount] = useState<number>(0);
  const [tif, setTif] = useState<number>();

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

  const errors = useMemo<ValidationErrors>(() => {
    const result: ValidationErrors = {};

    if (!tokenA) result.a = new Error("Required");
    if (!tokenB) result.b = new Error("Required");
    if (!amount) result.amount = new Error("Specify the amount of token");
    if (Number.isNaN(Number(amount)))
      result.amount = new Error("Should be the number");

    return result;
  }, [tokenA, tokenB, amount]);

  const onSubmit = useCallback(async () => {
    const params = {
      side,
      amount,
      decimals: tokenADecimals,
      aMint: tokenAMint,
      bMint: tokenBMint,
      nextPool: undefined,
      tifs,
      poolCounters,
      tif,
    };

    console.log("SEND", params);

    await execute(params);
  }, [
    execute,
    amount,
    side,
    tif,
    tokenAMint,
    tokenADecimals,
    tokenBMint,
    tifs,
    poolCounters,
  ]);

  const schedule = useMemo(() => {
    if (!tifs) return undefined;

    let intervals = tifs.filter((tif) => tif !== 0);
    return intervals;
  }, [tifs]);

  const isScheduled = false;

  const readableIntervals = useMemo(() => {
    if (!intervals.data) return undefined;

    return intervals.data.map((interval) => {
      const timeLeft = interval.left
        ? Number(((interval.left * 1e3 - Date.now()) / 1e3).toFixed(0))
        : interval.tif;

      return { tif: timeLeft, index: interval.index };
    });
  }, [intervals]);

  console.log("RI", readableIntervals);

  const intvals = !readableIntervals
    ? schedule
    : readableIntervals.filter(({ tif }) => tif).map((ri) => ri.tif);

  return (
    <Form onSubmit={onSubmit} validate={() => errors}>
      {({ handleSubmit, submitting, valid }) => (
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
              tifs={intvals}
              value={tif}
              onSelect={onIntervalSelect}
            />
          </Box>
          <Styled.ConnectBox py={3}>
            <Styled.ConnectButton type="submit" disabled={!valid || submitting}>
              {isScheduled ? "Schedule Order" : "Place Order"}
            </Styled.ConnectButton>
          </Styled.ConnectBox>
        </form>
      )}
    </Form>
  );
};
