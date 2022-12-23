import Box from "@mui/material/Box";
import M from "easy-maybe/lib";
import { useCallback, useMemo, useState } from "react";
import { Form } from "react-final-form";

import type { SelectedTif } from "./trade-intervals";
import ConnectButton from "../atoms/token-pair-form-content-button";
import JupiterOrderProgress from "../organisms/jupiter-order-progress";
import TokenPairFormContent from "./token-pair-form-content";
import useScheduleOrder from "../../hooks/use-schedule-order";
import useTIFIntervals from "../../hooks/use-tif-intervals";
import useJupiterExchange from "../../hooks/use-jupiter-exchange";
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
  }, []);

  const onInstantIntervalSelect = useCallback(() => {
    setTif([undefined, -2]);
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

    if (tif[1] === -2) {
      const params = await formHelpers.prepare4Jupiter(
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

  const isScheduled = tif && (tif[1] ?? -1) > 0;

  return (
    <Form onSubmit={onSubmit} validate={() => errors}>
      {({ handleSubmit, valid, ...args }) => (
        <>
          <TokenPairFormContent
            handleSubmit={handleSubmit}
            lead={lead}
            slave={slave}
            intervalTifs={intervalTifs.data}
            isScheduled={isScheduled}
            onABSwap={onABSwap}
            onASelect={onASelect}
            onBSelect={onBSelect}
            onChangeAmount={onChangeAmount}
            onInstantIntervalSelect={onInstantIntervalSelect}
            onIntervalSelect={onIntervalSelect}
            submitting={submitting}
            tif={tif}
            valid={valid}
          />
          <Box py={3}>
            <ConnectButton
              form="exchange-form"
              scheduled={isScheduled}
              disabled={!valid || submitting}
            />
          </Box>
          <JupiterOrderProgress onUnmount={() => {}} params={values} />
        </>
      )}
    </Form>
  );
};
