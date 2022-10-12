import Box from "@mui/material/Box";
import { useCallback, useEffect, useReducer } from "react";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import Maybe from "../../types/maybe";
import intervalsReducer, {
  action,
  initialState,
} from "../../reducers/trade-intervals.reducer";
import TimeInterval from "../atoms/time-interval";

export type SelectedTif = [number];

export interface Props {
  indexedTifs: TMaybe<IndexedTIF[]>;
  onSelect: (arg0: SelectedTif) => void;
  value: number;
}

export default ({ onSelect, indexedTifs, value: tif }: Props) => {
  const [state, dispatch] = useReducer(intervalsReducer, initialState);

  console.log({ indexedTifs });

  useEffect(() => {
    Maybe.andThen2<IndexedTIF[], void>((data) => {
      dispatch(action.setTifs({ indexedTifs: data }));
    }, indexedTifs);

    return () => {};
  }, [indexedTifs]);

  const onScheduleSelect = useCallback(
    (value: number) => {
      dispatch(action.setSchedule({ tif: value }));

      // onSelect(state.pairSelected);
    },
    [dispatch, onSelect, state.pairSelected]
  );

  const onPeriodSelect = useCallback(
    (value: number) => {
      dispatch(action.setPeriod({ tif: value }));

      // onSelect(state.pairSelected);
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
          values={state.scheduleTifs}
          value={pairSelected[1]}
          onSelect={onScheduleSelect}
        />
      </Box>
      <Box pb={2}>
        <TimeInterval
          info=""
          label="Execution Period"
          values={state.periodTifs}
          value={pairSelected[0]}
          onSelect={onPeriodSelect}
        />
      </Box>
    </>
  );
};
