import Box from "@mui/material/Box";
import Maybe from "easy-maybe/lib";
import { useCallback, useEffect, useMemo, useReducer } from "react";

import intervalsReducer, {
  action,
  initialState,
} from "../../reducers/trade-intervals.reducer";
import TimeInterval from "../atoms/time-interval";

export type SelectedTif = [number | undefined, number | undefined];

export interface Props {
  indexedTifs: Voidable<IndexedTIF[]>;
  onSelect: (arg0: SelectedTif) => void;
  selectedTif?: SelectedTif;
}

export default ({ indexedTifs: tifs, onSelect, selectedTif }: Props) => {
  const indexedTifs = useMemo(() => Maybe.of(tifs), [tifs]);

  // @ts-ignore
  const [state, dispatch] = useReducer(intervalsReducer, initialState);

  // console.log(state.tifs, state.tifsLeft);

  useEffect(() => {
    Maybe.andMap<IndexedTIF[], void>((data) => {
      // @ts-ignore
      dispatch(action.setTifs({ indexedTifs: data, selectedTif }));
    }, indexedTifs);

    return () => {};
  }, [indexedTifs, selectedTif]);

  const onScheduleSelect = useCallback(
    (value: number) => {
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
    [dispatch, indexedTifs, onSelect]
  );

  const onPeriodSelect = useCallback(
    (value: number) => {
      const periodTif = state.indexedTifs.find(
        (itif: IndexedTIF) => itif.left === value
      );

      const tifValue = periodTif.tif;

      // @ts-ignore
      // dispatch(action.setPeriod({ tif: tifValue })); // value }));
      dispatch(action.setPeriod({ tif: value }));

      onSelect([value, state.pairSelected[1]]);
      // onSelect([tifValue, state.pairSelected[1]]);
    },
    [dispatch, onSelect, state.pairSelected, state.indexedTifs]
  );

  const { pairSelected = [] } = state;

  const selectedPair = Maybe.withDefault(
    [],
    Maybe.andMap((data) => {
      //console.log("psele", data, pairSelected);
      const itif = data.find((d) => d.tif === pairSelected[0]);

      if (!itif) return undefined;

      return [itif.left, pairSelected[1]];
    }, indexedTifs)
  );

  return (
    <>
      <Box pb={2}>
        <TimeInterval
          info=""
          label="Schedule Order"
          onSelect={onScheduleSelect}
          value={pairSelected[1]}
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
