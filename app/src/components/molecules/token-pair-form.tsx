import Box from "@mui/material/Box";
import M from "easy-maybe/lib";
import { OrderSide } from "@twamm/types/lib";
import { useCallback, useMemo, useState } from "react";
import { Form } from "react-final-form";

import type { SelectedTif } from "./trade-intervals";
import JupiterOrderProgress from "../organisms/jupiter-order-progress";
import ProgramOrderProgress from "../organisms/program-order-progress";
import TokenPairFormContent from "./token-pair-form-content";
import useTIFIntervals from "../../hooks/use-tif-intervals";
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
  side: Voidable<OrderSide>;
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
  const [amount, setAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [tif, setTif] = useState<SelectedTif>();

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
    setTif([undefined, instantTif]);
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
    } catch (e) {
      return undefined;
    }
  }, [
    amount,
    intervalTifs.data,
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

  const isScheduled = Boolean(tif && (tif[1] ?? -1) > 0);

  return (
    <Form onSubmit={onSubmit} validate={() => errors}>
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
