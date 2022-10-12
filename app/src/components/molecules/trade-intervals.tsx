import Box from "@mui/material/Box";
import { useCallback, useEffect, useReducer } from "react";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import Maybe from "../../types/maybe";
import type { TradeIntervals } from "../../hooks/use-tif-intervals";
import intervalsReducer, {
  action,
  initialState,
} from "../../reducers/trade-intervals.reducer";
import TimeInterval from "../atoms/time-interval";

export type SelectedTif = [number];

export interface Props {
  indexedTifs: TMaybe<IndexedTIF[]>;
  intervals: TMaybe<TradeIntervals>;
  onSelect: (arg0: SelectedTif) => void;
  value: number;
}

export default ({
  onSelect,
  indexedTifs,
  intervals,
  value: tif,
}: Props) => {
  const [state, dispatch] = useReducer(intervalsReducer, initialState);

  useEffect(() => {
    Maybe.andThen2<IndexedTIF[], void>((data) => {
      dispatch(action.setTifs({ indexedTifs: data }));
    }, indexedTifs);

    return () => {};
  }, [indexedTifs]);

  const onScheduleSelect = useCallback(
    (value: number) => {
      console.log("tif", intervals, { value });
      dispatch(action.setSchedule({ tif: value }));

      onSelect([value]);
    },
    [dispatch, onSelect]
  );

  const onPeriodSelect = useCallback(
    (value: number) => {
      dispatch(action.setPeriod({ tif: value }));

      onSelect([value]);
    },
    [dispatch, onSelect]
  );

  return (
    <>
      <Box pb={2}>
        <TimeInterval
          info=""
          label="Schedule Order"
          intervals={intervals}
          values={state.scheduleTifs}
          value={state.tifScheduled}
          onSelect={onScheduleSelect}
        />
      </Box>
      <Box pb={2}>
        <TimeInterval
          info=""
          label="Execution Period"
          intervals={intervals}
          values={state.periodTifs}
          value={state.tifSelected}
          onSelect={onPeriodSelect}
        />
      </Box>
    </>
  );
};
