import Box from "@mui/material/Box";
import { useCallback, useEffect, useReducer } from "react";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import intervalsReducer, {
  action,
  initialState,
} from "../../reducers/trade-intervals.reducer";
import TimeInterval from "../atoms/time-interval";

export type SelectedTif = [number];

export interface Props {
  intervals: TMaybe<any>;
  onSelect: (arg0: SelectedTif) => void;
  tifs?: number[];
  value: number;
}

// TODO: finalize intervals

export default ({ onSelect, tifs, intervals, value: tif }: Props) => {
  const [state, dispatch] = useReducer(intervalsReducer, initialState);

  console.log("tif", tif, intervals);

  useEffect(() => {
    if (tifs && tifs !== state.tifs) {
      dispatch(action.setTifs({ tifs, tifsLeft: tifs }));
    }

    return () => {};
  }, [state.tifs, tifs]);

  const onScheduleSelect = useCallback(
    (value: number) => {
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
          values={state.scheduleTifs}
          value={state.tifScheduled}
          onSelect={onScheduleSelect}
        />
      </Box>
      <Box pb={2}>
        <TimeInterval
          info=""
          label="Execution Period"
          values={state.periodTifs}
          value={state.tifSelected}
          onSelect={onPeriodSelect}
        />
      </Box>
    </>
  );
};
