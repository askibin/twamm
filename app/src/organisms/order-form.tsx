import Box from "@mui/material/Box";
import M from "easy-maybe/lib";
import { OrderSide } from "@twamm/types/lib";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Form } from "react-final-form";

import * as formHelpers from "../domain/order";
import ExchangePairForm from "../molecules/exchange-pair-form";
import JupiterOrderProgress from "./jupiter-order-progress";
import ProgramOrderProgress from "./program-order-progress";
import { SpecialIntervals } from "../domain/interval.d";
import type { PoolTIF, SelectedTIF } from "../domain/interval.d";
import type { ValidationErrors } from "../domain/order";

export default ({
  primary,
  secondary,
  intervalTifs,
  minTimeTillExpiration,
  onABSwap,
  onASelect,
  onBSelect,
  poolCounters: counters,
  poolTifs,
  side: s,
  tokenA,
  tokenADecimals,
  tokenB,
  tokenPair: pair,
}: {
  primary: Voidable<TokenInfo>;
  secondary: Voidable<TokenInfo>;
  intervalTifs: Voidable<PoolTIF[]>;
  minTimeTillExpiration: Voidable<number>;
  onABSwap: () => void;
  onASelect: () => void;
  onBSelect: () => void;
  poolCounters: Voidable<PoolCounter[]>;
  poolTifs: Voidable<number[]>;
  side: Voidable<OrderSide>;
  tokenA?: string;
  tokenADecimals?: number;
  tokenB?: string;
  tokenPair: Voidable<TokenPair<JupToken>>;
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [tif, setTif] = useState<SelectedTIF>();

  const tifs = M.withDefault(undefined, M.of(poolTifs));
  const poolCounters = M.withDefault(undefined, M.of(counters));
  const side = M.withDefault(undefined, M.of(s));
  const tokenPair = M.withDefault(undefined, M.of(pair));

  const intervalsChecksum = useMemo(() => {
    if (!intervalTifs) return 0;
    return intervalTifs.reduce((acc, i) => acc + i.left, 0);
  }, [intervalTifs]);

  useEffect(() => {
    if (!intervalsChecksum && tif && tif[0] !== SpecialIntervals.INSTANT) {
      setTif(undefined);
    }
    // cleanup selected interval
  }, [intervalTifs, intervalsChecksum, tif]);

  const onChangeAmount = useCallback(
    (value: number) => {
      setAmount(value);
    },
    [setAmount]
  );

  const onIntervalSelect = useCallback((selectedTif: SelectedTIF) => {
    setTif(selectedTif);
  }, []);

  const onInstantIntervalSelect = useCallback(() => {
    setTif([undefined, SpecialIntervals.INSTANT]);
  }, []);

  const errors = useMemo<Voidable<ValidationErrors>>(
    () => formHelpers.validate(amount, tif, tokenA, tokenB),
    [amount, tif, tokenA, tokenB]
  );

  const jupiterParams = useMemo(() => {
    if (!side) return undefined;
    if (!tif) return undefined;
    if (!tokenADecimals) return undefined;
    if (!tokenPair) return undefined;

    const [a, b] = tokenPair;
    const params = formHelpers.prepare4Jupiter(
      side,
      amount,
      tokenADecimals,
      a.address,
      b.address
    );

    return params;
  }, [amount, side, tif, tokenPair, tokenADecimals]);

  const programParams = useMemo(() => {
    if (!poolCounters) return undefined;
    if (!tif) return undefined;
    if (!tifs) return undefined;
    if (!tokenADecimals) return undefined;
    if (!side) return undefined;
    if (!tokenPair) return undefined;
    const [a, b] = tokenPair;
    const [timeInForce, nextPool] = tif ?? [];

    try {
      const params = formHelpers.prepare4Program(
        timeInForce,
        nextPool,
        intervalTifs,
        side,
        amount,
        tokenADecimals,
        a.address,
        b.address,
        tifs,
        poolCounters
      );
      return params;
    } catch (e) {
      return undefined;
    }
  }, [
    amount,
    intervalTifs,
    poolCounters,
    side,
    tif,
    tifs,
    tokenPair,
    tokenADecimals,
  ]);

  const onSubmit = () => {
    setSubmitting(true);
  };

  const onSuccess = () => {
    setSubmitting(false);
  };

  return (
    <Form onSubmit={onSubmit} validate={() => errors}>
      {({ handleSubmit, valid }) => (
        <>
          <ExchangePairForm
            amount={amount}
            intervalTifs={intervalTifs}
            primary={primary}
            minTimeTillExpiration={minTimeTillExpiration}
            onABSwap={onABSwap}
            onASelect={onASelect}
            onBSelect={onBSelect}
            onChange={() => {}}
            onChangeAmount={onChangeAmount}
            onInstantIntervalSelect={onInstantIntervalSelect}
            onIntervalSelect={onIntervalSelect}
            onSubmit={handleSubmit}
            secondary={secondary}
            submitting={submitting}
            tif={tif}
          />
          <Box py={3}>
            {tif && tif[0] === SpecialIntervals.INSTANT ? (
              <JupiterOrderProgress
                disabled={!valid || submitting}
                form="exchange-form"
                onSuccess={onSuccess}
                params={jupiterParams}
                progress={submitting}
                validate={() => errors}
              />
            ) : (
              <ProgramOrderProgress
                disabled={!valid || submitting}
                form="exchange-form"
                onSuccess={onSuccess}
                params={programParams}
                progress={submitting}
                scheduled={Boolean(tif && tif[1] > 0)}
                validate={() => errors}
              />
            )}
          </Box>
        </>
      )}
    </Form>
  );
};
