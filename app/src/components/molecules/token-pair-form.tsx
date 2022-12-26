import Box from "@mui/material/Box";
import M from "easy-maybe/lib";
import { useCallback, useMemo, useState } from "react";
import { Form } from "react-final-form";

import type { SelectedTif } from "./trade-intervals";
import JupiterOrderProgress from "../organisms/jupiter-order-progress";
import ProgramOrderProgress from "../organisms/program-order-progress";
import TokenPairFormContent from "./token-pair-form-content";
import useScheduleOrder from "../../hooks/use-schedule-order";
import useTIFIntervals from "../../hooks/use-tif-intervals";
import useJupiterExchange from "../../hooks/use-jupiter-exchange";
import { instantTif } from "../../reducers/trade-intervals.reducer";
import { refreshEach } from "../../swr-options";
import type { ValidationErrors } from "./token-pair-form.utils";
import * as formHelpers from "./token-pair-form.utils";

export interface Props {
  lead: Voidable<TokenInfo>;
  slave: Voidable<TokenInfo>;
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

export default ({
  lead,
  slave,
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
  tokenPair: pair,
}: Props) => {
  const { execute: sendToProgram } = useScheduleOrder();
  const { execute: sendToJupiter } = useJupiterExchange();

  const [amount, setAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [tif, setTif] = useState<SelectedTif>();
  const [values, setValues] = useState();

  const tifs = M.withDefault(undefined, M.of(poolTifs));
  const currentPoolPresent = M.withDefault(undefined, M.of(poolsCurrent));
  const poolCounters = M.withDefault(undefined, M.of(counters));
  const side = M.withDefault(undefined, M.of(s));
  const tokenPair = M.withDefault(undefined, M.of(pair));

  const intervalTifs = useTIFIntervals(
    tokenPair,
    tifs,
    currentPoolPresent,
    poolCounters,
    { ...refreshEach(50e3) }
  );

  const onChangeAmount = useCallback(
    (value: number) => {
      setAmount(value);
    },
    [setAmount]
  );

  const onIntervalSelect = useCallback((selectedTif: SelectedTif) => {
    setTif(selectedTif);
    console.log("nextPool", 45, selectedTif);
  }, []);

  const onInstantIntervalSelect = useCallback(() => {
    setTif([undefined, instantTif]);
  }, []);

  const errors = useMemo<ValidationErrors>(
    () => formHelpers.validate(amount, tif, tokenA, tokenB),
    [amount, tif, tokenA, tokenB]
  );

  const onSubmit = useCallback(async () => {
    if (!tokenPair) throw new Error("Pair is absent");
    if (!tif) throw new Error("Please choose the intervals");
    if (!tokenADecimals) throw new Error("Absent decimals");
    if (!side) throw new Error("Absent side");
    if (!poolCounters) throw new Error("Absent counters");
    if (!tifs) throw new Error("Absent tifs");

    const [a, b] = tokenPair;
    const [timeInForce, nextPool] = tif ?? [];

    if (tif[1] === instantTif) {
      const params = formHelpers.prepare4Jupiter(
        side,
        amount,
        tokenADecimals,
        a.address,
        b.address
      );

      setValues(params);

      setSubmitting(true);
      await sendToJupiter(params);
      setSubmitting(false);

      return params;
    } else {
      const params = await formHelpers.prepare4Program(
        timeInForce,
        nextPool,
        intervalTifs.data,
        side,
        amount,
        tokenADecimals,
        a.address,
        b.address,
        tifs,
        poolCounters
      );

      setSubmitting(true);
      await sendToProgram(params);
      setSubmitting(false);
    }
  }, [
    amount,
    sendToProgram,
    sendToJupiter,
    setValues,
    intervalTifs.data,
    poolCounters,
    side,
    tif,
    tifs,
    tokenADecimals,
    tokenPair,
  ]);

  const jupiterParams = useMemo(() => {
    if (!tokenPair) return undefined;
    if (!tokenADecimals) return undefined;
    if (!tif) return undefined;

    const [a, b] = tokenPair;
    const [timeInForce, nextPool] = tif ?? [];

    const params = formHelpers.prepare4Jupiter(
      side,
      amount,
      tokenADecimals,
      a.address,
      b.address
    );

    return params;
  }, [amount, side, tif, tokenPair, tokenADecimals]);

  const onSubmit1 = () => {
    setSubmitting(true);
  };

  const populateJupiterData = useCallback(async () => {
    const [a, b] = tokenPair;
    const [timeInForce, nextPool] = tif ?? [];

    const params = formHelpers.prepare4Jupiter(
      side,
      amount,
      tokenADecimals,
      a.address,
      b.address
    );

    return params;
  }, [tokenPair, tif]);

  const populateProgramData = useCallback(async () => {
    const [a, b] = tokenPair;
    const [timeInForce, nextPool] = tif ?? [];

    const params = await formHelpers.prepare4Program(
      timeInForce,
      nextPool,
      intervalTifs.data,
      side,
      amount,
      tokenADecimals,
      a.address,
      b.address,
      tifs,
      poolCounters
    );

    return params;
  }, [tokenPair, tif]);

  const onDataChange = useCallback(async () => {
    const params =
      tif && tif[1] === instantTif
        ? await populateJupiterData()
        : await populateProgramData();
    console.log("changing", params);
  }, [tif]);

  const isScheduled = Boolean(tif && (tif[1] ?? -1) > 0);

  return (
    <Form onSubmit={onSubmit1} validate={() => errors}>
      {({ handleSubmit, valid }) => (
        <>
          <TokenPairFormContent
            intervalTifs={intervalTifs.data}
            lead={lead}
            onABSwap={onABSwap}
            onASelect={onASelect}
            onBSelect={onBSelect}
            onChange={() => {}}
            onChangeAmount={onChangeAmount}
            onInstantIntervalSelect={onInstantIntervalSelect}
            onIntervalSelect={onIntervalSelect}
            onSubmit={handleSubmit}
            slave={slave}
            submitting={submitting}
            tif={tif}
          />
          <Box py={3}>
            {tif && tif[1] === instantTif ? (
              <JupiterOrderProgress
                disabled={!valid || submitting}
                form="exchange-form"
                params={jupiterParams}
                progress={submitting}
                validate={() => errors}
              />
            ) : (
              <ProgramOrderProgress
                disabled={!valid || submitting}
                form="exchange-form"
                params={values}
                populateParams={populateProgramData}
                progress={submitting}
                scheduled={isScheduled}
                validate={() => errors}
              />
            )}
          </Box>
        </>
      )}
    </Form>
  );
};
