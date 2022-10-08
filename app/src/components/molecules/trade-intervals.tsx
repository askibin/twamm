import type { SWRResponse } from "swr";
import Box from "@mui/material/Box";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import type { MaybeResponse } from "../../types/global.d";
import intervalsReducer, {
  action,
  initialState,
} from "../../reducers/trade-intervals.reducer";

import TimeInterval from "../atoms/time-interval";

export type SelectedTif = [number, boolean];

export interface Props {
  onSelect: (arg0: SelectedTif) => void;
  a: OrderType;
  tifs?: number[];
  intervals: MaybeResponse<any>;
}

export default ({ onSelect, tifs, intervals, value: tif }: Props) => {
  const [state, dispatch] = useReducer(intervalsReducer, initialState);

  console.log("state", state);

  useEffect(() => {
    if (tifs && tifs !== state.tifs) {
      console.log("state", "effect", tifs);
      dispatch(action.setTifs({ tifs, tifsLeft: tifs }));
    }

    return () => {};
  }, [state.tifs, tifs]);

  const onScheduleSelect = useCallback(
    (value: number) => {
      dispatch(action.setSchedule({ tif: value }));

      console.log('state', value)

      onSelect([value]);
    },
    [dispatch, onSelect]
  );

  const onPeriodSelect = useCallback(
    (value: number) => {
      dispatch(action.setPeriod({ tif: value }));

      console.log('state', value)

      onSelect([value]);
    },
    [dispatch, onSelect]
  );

  const ttifs = intervals.data;

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
