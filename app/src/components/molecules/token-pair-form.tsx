import Maybe from "easy-maybe/lib";
import { useCallback, useMemo, useState } from "react";
import { Form } from "react-final-form";

import type { SelectedTif } from "./trade-intervals";
import TokenPairFormContent from "./token-pair-form-content";
import useScheduleOrder from "../../hooks/use-schedule-order";
import useTIFIntervals from "../../hooks/use-tif-intervals";

export interface Props {
  onABSwap: () => void;
  onASelect: () => void;
  onBSelect: () => void;
  poolCounters: Voidable<PoolCounter[]>;
  poolsCurrent: Voidable<boolean[]>;
  poolTifs: Voidable<number[]>;
  side: Voidable<OrderType>;
  tokenA?: string;
  tokenADecimals?: number;
  tokenB?: string;
  tokenPair: Voidable<TokenPair<JupToken>>;
}

type ValidationErrors = { a?: Error; b?: Error; amount?: Error; tif?: Error };

export default ({
  onABSwap,
  onASelect,
  onBSelect,
  poolCounters: counters,
  poolsCurrent,
  poolTifs,
  side: s,
  tokenA,
  tokenADecimals,
  tokenB,
  tokenPair: tp,
}: Props) => {
  const { execute } = useScheduleOrder();

  const [amount, setAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [tif, setTif] = useState<SelectedTif>();

  const tifs = Maybe.withDefault(undefined, Maybe.of(poolTifs));
  const currentPoolPresent = Maybe.withDefault(
    undefined,
    Maybe.of(poolsCurrent)
  );
  const poolCounters = Maybe.withDefault(undefined, Maybe.of(counters));
  const side = Maybe.withDefault(undefined, Maybe.of(s));
  const tokenPair = Maybe.withDefault(undefined, Maybe.of(tp));

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
    const [timeInForce /* , nextPool */] = tif ?? [];

    const realTif = intervalTifs.data?.find(
      (itif: { tif: number; index: number; left: number }) =>
        itif.left === timeInForce
    );

    if (!timeInForce) throw new Error("Absent tif");
    if (!realTif) throw new Error("Wrong tif");

    const params = {
      side,
      amount,
      decimals: tokenADecimals,
      aMint: a.address,
      bMint: b.address,
      nextPool: realTif.tif !== realTif.left, // nextPool ? nextPool > 0 : false,
      tifs,
      poolCounters,
      tif: realTif.tif,
    };

    setSubmitting(true);

    await execute(params);
    setSubmitting(false);
  }, [
    amount,
    execute,
    intervalTifs.data,
    poolCounters,
    side,
    tif,
    tifs,
    tokenADecimals,
    tokenPair,
  ]);

  const isScheduled = tif && (tif[1] ?? -1) > 0;

  return (
    <Form onSubmit={onSubmit} validate={() => errors}>
      {({ handleSubmit, valid }) => (
        <TokenPairFormContent
          handleSubmit={handleSubmit}
          intervalTifs={intervalTifs.data}
          isScheduled={isScheduled}
          onABSwap={onABSwap}
          onASelect={onASelect}
          onBSelect={onBSelect}
          onChangeAmount={onChangeAmount}
          onIntervalSelect={onIntervalSelect}
          submitting={submitting}
          tif={tif}
          tokenPair={tokenPair}
          tradeSide={side}
          valid={valid}
        />
      )}
    </Form>
  );
};
