import Box from "@mui/material/Box";
import M from "easy-maybe/lib";
import { useCallback, useEffect, useMemo, useState } from "react";

import TimeInterval from "../atoms/time-interval";
import type { OptionalIntervals } from "../reducers/trade-intervals.reducer.d";
import type { PoolTIF, SelectedTIF } from "../domain/interval.d";
import useTradeIntervals, { action as A } from "../hooks/use-trade-intervals";
import { SpecialIntervals } from "../reducers/trade-intervals.reducer.d";

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

  // @ts-ignore
  const [state, dispatch] = useTradeIntervals();
  const [instant, setInstant] = useState<Voidable<number>>();

  const optionalIntervals: OptionalIntervals = useMemo(
    () => ({
      0: [
        {
          tif: SpecialIntervals.INSTANT,
          index: -2,
          left: SpecialIntervals.INSTANT,
        },
      ],
      // do not use -1 as index to distinct this specific option from `NO_DELAY`
    }),
    []
  );

  useEffect(() => {
    M.andMap<PoolTIF[], void>((t) => {
      dispatch(
        // @ts-ignore
        A.setTifs({
          indexedTifs: t,
          minTimeTillExpiration,
          optionalIntervals,
          selectedTif,
        })
      );
    }, M.of(indexedTifs));

    return () => {};
  }, [
    dispatch,
    indexedTifs,
    minTimeTillExpiration,
    optionalIntervals,
    selectedTif,
  ]);

  const onScheduleSelect = useCallback(
    (value: number) => {
      if (value === SpecialIntervals.INSTANT) {
        onSelectInstant();
        setInstant(SpecialIntervals.INSTANT);
        return;
      }

      if (instant) setInstant(undefined);

      // @ts-ignore
      dispatch(A.setSchedule({ tif: value }));
      console.info("TIF1 setschedule", { tif: value });

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
      // @ts-ignore
      // dispatch(A.setPeriod({ tif: tifValue })); // value }));
      dispatch(A.setPeriod({ tif: value }));

      onSelect([value, state.pairSelected[1]]);
    },
    [dispatch, onSelect, state.pairSelected]
  );

  const { pairSelected = [] } = state;

  return (
    <>
      <Box pb={2}>
        <TimeInterval
          disabled={disabled}
          info=""
          label="Schedule Order"
          onSelect={onScheduleSelect}
          value={instant || pairSelected[1]}
          values={state.scheduleTifs}
        />
      </Box>
      <Box pb={2}>
        <TimeInterval
          disabled={disabled}
          info=""
          label="Execution Period"
          onSelect={onPeriodSelect}
          value={pairSelected[0]}
          values={state.periodTifs}
        />
      </Box>
    </>
  );
};
