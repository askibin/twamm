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
  poolCounters: TMaybe<PoolCounter[]>;
  poolsCurrent: TMaybe<boolean[]>;
  poolTifs: TMaybe<number[]>;
  side: TMaybe<OrderType>;
  tokenA?: string;
  tokenADecimals?: number;
  tokenAImage?: string;
  tokenB?: string;
  tokenBImage?: string;
  tokenPair: TMaybe<TokenPair>;
}

type ValidationErrors = { a?: Error; b?: Error; amount?: Error; tif?: Error };

const defaultVal = Maybe.withDefault;

export default ({
  onABSwap,
  onASelect,
  onBSelect,
  poolCounters: mbPoolCounters,
  poolsCurrent: mbPoolsCurrent,
  poolTifs: mbTifs,
  side: mbSide,
  tokenA,
  tokenADecimals,
  tokenAImage,
  tokenB,
  tokenBImage,
  tokenPair: mbTokenPair,
}: Props) => {
  const { execute } = useScheduleOrder();

  const [amount, setAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [tif, setTif] = useState<SelectedTif>();

  const tifs = defaultVal(undefined, mbTifs);
  const currentPoolPresent = defaultVal(undefined, mbPoolsCurrent);
  const poolCounters = defaultVal(undefined, mbPoolCounters);
  const side = defaultVal(undefined, mbSide);
  const tokenPair = defaultVal(undefined, mbTokenPair);

  const intervalTifs = useTIFIntervals(
    tokenPair,
    tifs,
    currentPoolPresent,
    poolCounters
  );

  const onChangeAmount = useCallback(
    (value: number) => {
      setAmount(value);
    },
    [setAmount]
  );

  const onIntervalSelect = useCallback((selectedTif: SelectedTif) => {
    setTif(selectedTif);
  }, []);

  const errors = useMemo<ValidationErrors>(() => {
    const result: ValidationErrors = {};

    if (!tokenA) result.a = new Error("Required");
    if (!tokenB) result.b = new Error("Required");
    if (!amount) result.amount = new Error("Specify the amount of token");
    if (Number.isNaN(Number(amount)))
      result.amount = new Error("Should be the number");
    if (tif) {
      const [timeInForce] = tif;
      if (!timeInForce) {
        result.tif = new Error("Should choose the interval");
      }
    } else if (!tif) {
      result.tif = new Error("Should choose the interval");
    }
    return result;
  }, [amount, tif, tokenA, tokenB]);

  const onSubmit = useCallback(async () => {
    if (!tokenPair) throw new Error("Pair is absent");
    if (!tif) throw new Error("Please choose the intervals");
    if (!tokenADecimals) throw new Error("Absent decimals");
    if (!side) throw new Error("Absent side");
    if (!poolCounters) throw new Error("Absent counters");
    if (!tifs) throw new Error("Absent tifs");

    const [a, b] = tokenPair;
    const [timeInForce, nextPool] = tif ?? [];

    if (!timeInForce) throw new Error("Absent tif");

    const params = {
      side,
      amount,
      decimals: tokenADecimals,
      aMint: a.address,
      bMint: b.address,
      nextPool: nextPool ? nextPool > 0 : false,
      tifs,
      poolCounters,
      tif: timeInForce,
    };

    setSubmitting(true);

    await execute(params);

    setSubmitting(false);
  }, [
    execute,
    amount,
    side,
    tif,
    tokenADecimals,
    tifs,
    poolCounters,
    tokenPair,
  ]);

  const isScheduled = tif && (tif[1] ?? -1) > 0;

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
              indexedTifs={Maybe.of(intervalTifs.data)}
              selectedTif={tif}
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
