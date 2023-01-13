import Box from "@mui/material/Box";
import M from "easy-maybe/lib";
import { useCallback, useEffect, useMemo, useState } from "react";

import TimeInterval from "../atoms/time-interval";
import type { PoolTIF, SelectedTIF } from "../domain/interval.d";
import useTradeIntervals, { action as A } from "../hooks/use-trade-intervals";
import { optionalIntervals } from "../domain/interval";
import { SpecialIntervals } from "../domain/interval.d";

export default ({
  disabled,
  indexedTifs: tifs,
  minTimeTillExpiration,
  onSelect,
  onSelectInstant,
  selectedTif,
}: {
  disabled: boolean;
  indexedTifs: Voidable<PoolTIF[]>;
  minTimeTillExpiration: Voidable<number>;
  onSelect: (arg0: SelectedTIF) => void;
  onSelectInstant: () => void;
  selectedTif?: SelectedTIF;
}) => {
  const indexedTifs = useMemo(() => tifs, [tifs]);

  const [state, dispatch] = useTradeIntervals();
  const [instant, setInstant] = useState<Voidable<number>>();

  useEffect(() => {
    M.andMap<PoolTIF[], void>((t) => {
      dispatch(
        A.setTifs({
          indexedTifs: t,
          minTimeTillExpiration,
          optionalIntervals,
          selectedTif: selectedTif ?? [undefined, SpecialIntervals.NO_DELAY],
        })
      );
    }, M.of(indexedTifs));

    return () => {};
  }, [dispatch, indexedTifs, minTimeTillExpiration, selectedTif]);

  const onScheduleSelect = useCallback(
    (value: number) => {
      if (value === SpecialIntervals.INSTANT) {
        onSelectInstant();
        setInstant(SpecialIntervals.INSTANT);
        return;
      }

      if (instant) setInstant(undefined);

      dispatch(A.setSchedule({ tif: value }));

      M.tap((itifs) => {
        onSelect([
          value !== -1
            ? itifs.find((itif) => itif.left === value)?.tif
            : undefined,
          value,
        ]);
      }, M.of(indexedTifs));
    },
    [dispatch, indexedTifs, instant, onSelect, onSelectInstant]
  );

  const onPeriodSelect = useCallback(
    (value: number) => {
      if (!state.data?.pairSelected) return;
      dispatch(A.setPeriod({ tif: value }));

      onSelect([value, state.data.pairSelected[1]]);
    },
    [dispatch, onSelect, state.data]
  );

  const { pairSelected = [] } = state.data ?? {};

  return (
    <>
      <Box pb={2}>
        <TimeInterval
          disabled={disabled}
          info=""
          label="Schedule Order"
          onSelect={onScheduleSelect}
          value={instant || pairSelected[1]}
          values={state.data?.scheduleTifs}
        />
      </Box>
      <Box pb={2}>
        <TimeInterval
          disabled={disabled}
          info=""
          label="Execution Period"
          onSelect={onPeriodSelect}
          value={pairSelected[0]}
          values={state.data?.periodTifs}
        />
      </Box>
    </>
  );
};
