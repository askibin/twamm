import Box from "@mui/material/Box";
import Maybe from "easy-maybe/lib";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { OptionalIntervals } from "../reducers/trade-intervals.reducer";
import { instantTif } from "../reducers/trade-intervals.reducer";
import TimeInterval from "../atoms/time-interval";
import useTradeIntervals, { action as A } from "../hooks/use-trade-intervals";

const INSTANT_INTERVAL = instantTif;

export type SelectedTif = [number | undefined, number | undefined];

export default ({
  disabled,
  indexedTifs: tifs,
  minTimeTillExpiration,
  onSelect,
  onSelectInstant,
  selectedTif,
}: {
  disabled: boolean;
  indexedTifs: Voidable<IndexedTIF[] | PoolIndexedTIF[]>;
  minTimeTillExpiration: Voidable<number>;
  onSelect: (arg0: SelectedTif) => void;
  onSelectInstant: () => void;
  selectedTif?: SelectedTif;
}) => {
  const indexedTifs = useMemo(() => Maybe.of(tifs), [tifs]);

  // @ts-ignore
  const [state, dispatch] = useTradeIntervals();
  const [instant, setInstant] = useState<Voidable<number>>();

  const optionalIntervals: OptionalIntervals = useMemo(
    () => ({
      0: [{ tif: instantTif, index: -2, left: instantTif }],
      // do not use -1 as index to distinct this specific option from `no-delay`
    }),
    []
  );

  useEffect(() => {
    Maybe.andMap<IndexedTIF[], void>((data) => {
      dispatch(
        // @ts-ignore
        A.setTifs({
          indexedTifs: data,
          // @ts-ignore
          minTimeTillExpiration,
          optionalIntervals,
          // @ts-ignore
          selectedTif,
        })
      );
    }, indexedTifs);

    return () => {};
  }, [indexedTifs, minTimeTillExpiration, optionalIntervals, selectedTif]);

  const onScheduleSelect = useCallback(
    (value: number) => {
      if (value === INSTANT_INTERVAL) {
        onSelectInstant();
        setInstant(INSTANT_INTERVAL);
        return;
      }

      if (instant) setInstant(undefined);

      // @ts-ignore
      dispatch(A.setSchedule({ tif: value }));

      Maybe.tap((itifs) => {
        onSelect([
          value !== -1
            ? itifs.find((itif) => itif.left === value)?.tif
            : undefined,
          value,
        ]);
      }, indexedTifs);
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
