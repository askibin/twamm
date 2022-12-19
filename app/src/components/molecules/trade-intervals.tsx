import Box from "@mui/material/Box";
import Maybe from "easy-maybe/lib";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import intervalsReducer, {
  action,
  initialState,
} from "../../reducers/trade-intervals.reducer";
import TimeInterval, { INSTANT_INTERVAL } from "../atoms/time-interval";

export type SelectedTif = [number | undefined, number | undefined];

export interface Props {
  indexedTifs: Voidable<IndexedTIF[]>;
  onSelect: (arg0: SelectedTif) => void;
  onSelectInstant: () => void;
  selectedTif?: SelectedTif;
}

export default ({
  indexedTifs: tifs,
  onSelect,
  onSelectInstant,
  selectedTif,
}: Props) => {
  const indexedTifs = useMemo(() => Maybe.of(tifs), [tifs]);

  // @ts-ignore
  const [state, dispatch] = useReducer(intervalsReducer, initialState);
  const [instant, setInstant] = useState<Voidable<number>>();

  useEffect(() => {
    Maybe.andMap<IndexedTIF[], void>((data) => {
      // @ts-ignore
      dispatch(action.setTifs({ indexedTifs: data, selectedTif }));
    }, indexedTifs);

    return () => {};
  }, [indexedTifs, selectedTif]);

  const onScheduleSelect = useCallback(
    (value: number) => {
      if (value === INSTANT_INTERVAL) {
        onSelectInstant();
        setInstant(INSTANT_INTERVAL);
        return;
      }

      if (instant) setInstant(undefined);

      // @ts-ignore
      dispatch(action.setSchedule({ tif: value }));

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
      // dispatch(action.setPeriod({ tif: tifValue })); // value }));
      dispatch(action.setPeriod({ tif: value }));

      onSelect([value, state.pairSelected[1]]);
    },
    [dispatch, onSelect, state.pairSelected]
  );

  const { pairSelected = [] } = state;

  return (
    <>
      <Box pb={2}>
        <TimeInterval
          info=""
          label="Schedule Order"
          onSelect={onScheduleSelect}
          onSelectInstant={onScheduleSelect}
          useInstantOption
          value={instant || pairSelected[1]}
          values={state.scheduleTifs}
        />
      </Box>
      <Box pb={2}>
        <TimeInterval
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
