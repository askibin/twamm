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
  onABSwap: () => void;
  onASelect: () => void;
  onBSelect: () => void;
  orderType: TMaybe<OrderType>;
  poolCounters: TMaybe<PoolCounter[]>;
  poolsCurrent: TMaybe<boolean[]>;
  poolTifs: TMaybe<number[]>;
  side: TMaybe<OrderType>;
  tokenA?: string;
  tokenADecimals?: number;
  tokenAImage?: string;
  tokenAMint?: string;
  tokenB?: string;
  tokenBImage?: string;
  tokenBMint?: string;
  tokenPair: TMaybe<TokenPair>;
}

type ValidationErrors = { a?: Error; b?: Error; amount?: Error };

const defaultVal = Maybe.withDefault;

export default ({
  onABSwap,
  onASelect,
  onBSelect,
  orderType: mbOrderType,
  poolCounters: mbPoolCounters,
  poolsCurrent: mbPoolsCurrent,
  poolTifs: mbTifs,
  side: mbSide,
  tokenA,
  tokenADecimals,
  tokenAImage,
  tokenAMint,
  tokenB,
  tokenBImage,
  tokenBMint,
  tokenPair: mbTokenPair,
}: Props) => {
  const { execute } = useScheduleOrder();

  const [amount, setAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [tif, setTif] = useState<number>();

  const tifs = defaultVal(undefined, mbTifs);
  const currentPoolPresent = defaultVal(undefined, mbPoolsCurrent);
  const poolCounters = defaultVal(undefined, mbPoolCounters);
  const side = defaultVal(undefined, mbSide);
  const tokenPair = defaultVal(undefined, mbTokenPair);
  const orderType = defaultVal(undefined, mbOrderType);

  const intervalTifs = useTIFIntervals(
    tokenPair && tifs && currentPoolPresent && poolCounters
      ? { tokenPair, tifs, currentPoolPresent, poolCounters }
      : undefined
  );

  const { indexedTifs, intervals } = Maybe.withDefault(
    { indexedTifs: undefined, intervals: [] },
    Maybe.of(intervalTifs.data)
  );

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

    return;

    setSubmitting(true);

    await execute(params);

    setSubmitting(false);
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

    let intervals2 = tifs.filter((tif) => tif !== 0);
    return intervals2;
  }, [tifs]);

  const isScheduled = false;

  const readableIntervals = useMemo(() => {
    if (!intervals) return undefined;

    return intervals.map((interval) => {
      const timeLeft = interval.left
        ? Number(((interval.left * 1e3 - Date.now()) / 1e3).toFixed(0))
        : interval.tif;

      return { tif: timeLeft, index: interval.index };
    });
  }, [intervals]);

  const intvals = !readableIntervals
    ? schedule
    : readableIntervals.filter(({ tif }) => tif).map((ri) => ri.tif);

  return (
    <Form onSubmit={onSubmit} validate={() => errors}>
      {({ handleSubmit, valid }) => (
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
              intervals={Maybe.of(intervals)}
              indexedTifs={Maybe.of(indexedTifs)}
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
