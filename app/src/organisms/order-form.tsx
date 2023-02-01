import Box from "@mui/material/Box";
import M from "easy-maybe/lib";
import { Form } from "react-final-form";
import { OrderSide } from "@twamm/types/lib";
import { useCallback, useMemo, useState } from "react";

import * as formHelpers from "../domain/order";
import ExchangePairForm from "../molecules/exchange-pair-form";
import JupiterOrderProgress from "./jupiter-order-progress";
import ProgramOrderProgress from "./program-order-progress";
import type { IndexedTIF, PoolTIF, SelectedTIF } from "../domain/interval.d";
import type { ValidationErrors } from "../domain/order";
import useIndexedTIFs from "../contexts/tif-context";
import { SpecialIntervals } from "../domain/interval.d";

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
  tif,
  tokenA,
  tokenADecimals,
  tokenB,
  tokenPair: pair,
}: {
  primary?: TokenInfo;
  secondary?: TokenInfo;
  intervalTifs?: PoolTIF[];
  minTimeTillExpiration?: number;
  onABSwap: () => void;
  onASelect: () => void;
  onBSelect: () => void;
  poolCounters?: PoolCounter[];
  poolTifs?: number[];
  tif?: SelectedTIF;
  side?: OrderSide;
  tokenA?: string;
  tokenADecimals?: number;
  tokenB?: string;
  tokenPair?: TokenPair<JupToken>;
}) => {
  const { setTif } = useIndexedTIFs();

  const [amount, setAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const tifs = M.withDefault(undefined, M.of(poolTifs));
  const poolCounters = M.withDefault(undefined, M.of(counters));
  const side = M.withDefault(undefined, M.of(s));
  const tokenPair = M.withDefault(undefined, M.of(pair));

  const onChangeAmount = useCallback(
    (value: number) => {
      setAmount(value);
    },
    [setAmount]
  );

  const onIntervalSelect = useCallback(
    (selectedTif: SelectedTIF, indexedTIF: IndexedTIF, schedule: boolean) => {
      setTif(indexedTIF, schedule);
    },
    [setTif]
  );

  const onInstantIntervalSelect = useCallback(() => {
    // onTifSelect([undefined, SpecialIntervals.INSTANT]);
    setTif(SpecialIntervals.INSTANT, false);
  }, [setTif]);

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
