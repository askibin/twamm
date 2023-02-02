import type {
  IndexedTIF,
  OptionalIntervals,
  PoolTIF,
  SelectedTIF,
} from "../domain/interval.d";
import { populateTifs, sortTifs } from "./trade-intervals.reducer.util";
import { SpecialIntervals } from "../domain/interval.d";

// TODO: resolve union type issue
function byActivePool(poolTif: PoolTIF) {
  // @ts-expect-error
  const isIndexedTIF = typeof poolTif.poolStatus === "undefined";
  // @ts-expect-error
  const isActivePool = poolTif.poolStatus && poolTif.poolStatus.active;

  return isIndexedTIF || isActivePool;
}

function byExpirationTime(poolTif: PoolTIF, quota: number = 0) {
  if (poolTif.tif === poolTif.left) return true;
  // skip filtering as this interval does not have underlying pool

  const threshold = quota * poolTif.tif;

  return poolTif.left >= threshold;
}

const populateAvailableRecords = (
  list: IndexedTIF[],
  minTimeTillExpiration: number
) =>
  list
    .filter(byActivePool)
    .filter((t) => byExpirationTime(t, minTimeTillExpiration));

const populateIntervals = (list: IndexedTIF[]) => ({
  left: list.map((i) => i.tif),
  tifs: list.map((i) => i.tif),
});

interface Data {
  indexedTifs: IndexedTIF[];
  minTimeTillExpiration: number;
  optional: {} | OptionalIntervals;
  selected: IndexedTIF | undefined;
  scheduled: boolean;
  periodSelected: IndexedTIF | undefined;
  scheduleSelected: IndexedTIF | undefined;
  pairSelected: SelectedTIF;
  periodTifs: TIF[];
  scheduleTifs: TIF[];
  tifsLeft: TIF[];
  tifs: TIF[];
}

export interface State<D = undefined> {
  data: D;
}

enum ActionTypes {
  RESET_TIF = "RESET_TIF",
  SET_TIF = "SET_TIF",
  SET_TIFS = "SET_TIFS",
  SET_SCHEDULE = "SET_SCHEDULE",
  SET_PERIOD = "SET_PERIOD",
}

export const defaultState: State = {
  data: undefined,
};

const resetTif = (payload: { selectedTif: SelectedTIF }) => ({
  type: ActionTypes.RESET_TIF,
  payload,
});

const setTif = (payload: { value: number | IndexedTIF }) => ({
  type: ActionTypes.SET_TIF,
  payload,
});

const setTifs = (payload: {
  indexedTifs: PoolTIF[];
  minTimeTillExpiration: number | undefined;
  optionalIntervals: OptionalIntervals;
  selectedTif: SelectedTIF;
}) => ({
  type: ActionTypes.SET_TIFS,
  payload,
});

const setSchedule = (payload: { tif: TIF }) => ({
  type: ActionTypes.SET_SCHEDULE,
  payload,
});

const setPeriod = (payload: { tif: TIF }) => ({
  type: ActionTypes.SET_PERIOD,
  payload,
});

type Action =
  | ReturnType<typeof resetTif>
  | ReturnType<typeof setTif>
  | ReturnType<typeof setTifs>
  | ReturnType<typeof setSchedule>
  | ReturnType<typeof setPeriod>;

export const action = { resetTif, setTif, setTifs, setSchedule, setPeriod };

export default (
  state: State | State<Data>,
  act: Action
): State | State<Data> => {
  switch (act?.type) {
    case ActionTypes.RESET_TIF: {
      return state;
      if (!state.data) return state;

      const { selectedTif } = act.payload as ActionPayload<typeof resetTif>;

      const next = { ...state.data, pairSelected: selectedTif };

      return { data: next };
    }
    case ActionTypes.SET_TIFS: {
      const { minTimeTillExpiration } = state.data ?? {
        minTimeTillExpiration: 0,
      };

      const { indexedTifs, optionalIntervals, selectedTif } =
        act.payload as ActionPayload<typeof setTifs>;

      const availableTifs = populateAvailableRecords(
        indexedTifs,
        minTimeTillExpiration
      );
      const { left: tifsLeft, tifs } = populateIntervals(availableTifs);

      const tif = selectedTif ? selectedTif[1] : SpecialIntervals.NO_DELAY;
      // ensure that NO_DELAY is used
      const pairSelected: SelectedTIF = selectedTif;

      const { periodTifs } = populateTifs(
        tif,
        tifsLeft,
        availableTifs,
        optionalIntervals
      );

      const next = {
        indexedTifs: availableTifs,
        minTimeTillExpiration: minTimeTillExpiration ?? 0,
        optional: optionalIntervals,
        pairSelected,
        periodTifs: sortTifs(periodTifs),
        scheduleTifs: sortTifs([SpecialIntervals.NO_DELAY].concat(tifsLeft)),
        tifsLeft,
        tifs,
      };

      return { data: next };
    }
    // TODO: improve action to support setting the schedule by tif index.
    // there might be several intervals with the same amount of time left
    case ActionTypes.SET_SCHEDULE: {
      if (!state.data) return state;

      const { indexedTifs = [], optional, tifsLeft = [] } = state.data;
      const { tif } = act.payload as ActionPayload<typeof setSchedule>;

      const { pairSelected, periodTifs } = populateTifs(
        tif,
        tifsLeft,
        indexedTifs,
        optional
      );

      const next = {
        ...state.data,
        indexedTifs,
        pairSelected,
        periodTifs,
        scheduleTifs: [SpecialIntervals.NO_DELAY].concat(tifsLeft),
        tifsLeft,
      };

      return { data: next };
    }
    case ActionTypes.SET_PERIOD: {
      if (!state.data) return state;

      const { pairSelected: selected } = state.data;

      const { tif } = act.payload as ActionPayload<typeof setPeriod>;

      const [, nextTif] = selected;
      const pairSelected: SelectedTIF = [tif, nextTif];

      const next = { ...state.data, pairSelected };

      return { data: next };
    }
    default:
      throw new Error(`Unknown action: ${act?.type}`);
  }
};

export const reducer2 = (
  state: State | State<Data>,
  act: Action
): State | State<Data> => {
  switch (act?.type) {
    case ActionTypes.SET_TIFS: {
      const {
        indexedTifs,
        minTimeTillExpiration = 0,
        optionalIntervals,
        selectedTif,
      } = act.payload as ActionPayload<typeof setTifs>;

      const {
        periodSelected,
        scheduleSelected,
        selected,
        scheduled = false,
      } = state.data ?? {};

      const available = populateAvailableRecords(
        indexedTifs,
        minTimeTillExpiration
      );

      const { left: tifsLeft, tifs } = populateIntervals(available);

      const hasSelectedAtTifs =
        selected && Boolean(available?.find((i) => i.tif === selected.tif));

      const nextPeriodSelected = hasSelectedAtTifs ? periodSelected : undefined;
      const nextScheduleSelected = hasSelectedAtTifs
        ? scheduleSelected
        : undefined;
      const nextSelected = hasSelectedAtTifs ? selected : undefined;

      const tif = selectedTif ? selectedTif[1] : SpecialIntervals.NO_DELAY;
      // ensure that NO_DELAY is used
      // const pairSelected: SelectedTIF = selectedTif;

      /*
       *const periodTifs = scheduled [>nextScheduleSelected<]
       *  ? [nextScheduleSelected?.tif]
       *  : [];
       */

      const { pairSelected: prevSelected } = state.data ?? { pairSelected: -1 };

      const pairSelected = prevSelected;

      console.log({ scheduled, hasSelectedAtTifs, prevSelected });

      const periodTifs = scheduled
        ? [(prevSelected as IndexedTIF).tif]
        : [SpecialIntervals.INSTANT].concat(tifsLeft);

      const next = {
        indexedTifs: available,
        minTimeTillExpiration: minTimeTillExpiration ?? 0,
        optional: optionalIntervals,
        pairSelected,
        periodTifs,
        scheduleTifs: [SpecialIntervals.NO_DELAY].concat(tifsLeft),
        selected: nextSelected,
        periodSelected: nextPeriodSelected,
        scheduleSelected: nextScheduleSelected,
        scheduled,
        // tifsLeft,
        // tifs,
      };

      return { data: next };
    }
    // TODO: improve action to support setting the schedule by tif index.
    // there might be several intervals with the same amount of time left
    case ActionTypes.SET_SCHEDULE: {
      if (!state.data) return state;
      if (!act.payload) return state; // rework

      const { indexedTifs = [], optional, tifsLeft = [] } = state.data;

      const { tif, left, index } = act.payload as ActionPayload<
        typeof setSchedule
      >;
      const selected = { tif, left, index };

      const { pairSelected, periodTifs } = populateTifs(
        tif,
        tifsLeft,
        indexedTifs,
        optional
      );

      const tifsLeft2 = indexedTifs.map((i) => i.left);
      const periodTifs2 = [selected.tif];

      const next = {
        ...state.data,
        indexedTifs,
        pairSelected: selected,
        selected,
        scheduleSelected: selected,
        periodSelected: selected,
        periodTifs: periodTifs2,
        scheduleTifs: [SpecialIntervals.NO_DELAY].concat(tifsLeft2),
        // tifsLeft,
        scheduled: true,
      };

      return { data: next };
    }
    case ActionTypes.SET_PERIOD: {
      if (!state.data) return state;
      if (!act.payload) return state; // rework


      const { pairSelected: selected } = state.data;

      const { tif, left, index } = act.payload as ActionPayload<
        typeof setPeriod
      >;

      const selected2 = { tif, left, index };

      const tifsLeft = state.data.indexedTifs.map((i) => i.left);
      const periodTifs = [SpecialIntervals.INSTANT].concat(tifsLeft);
      const scheduleTifs = [SpecialIntervals.NO_DELAY].concat(tifsLeft);

      // const [, nextTif] = selected;
      // const pairSelected: SelectedTIF = [tif, nextTif];

      const next = {
        ...state.data,
        pairSelected: selected2,
        selected: selected2,
        scheduleSelected: SpecialIntervals.NO_DELAY,
        periodSelected: selected2,
        periodTifs,
        scheduleTifs,
        scheduled: state.data.scheduled,
      };

      return { data: next };
    }
    case ActionTypes.SET_TIF: {
      if (!state.data) return state;

      const { indexedTifs, minTimeTillExpiration } = state.data;
      const { value } = act.payload as ActionPayload<typeof setTif>;

      console.log({ value })

      const available = populateAvailableRecords(
        indexedTifs,
        minTimeTillExpiration
      );
      const { tifs, left } = populateIntervals(available);

      const periodTifs = [SpecialIntervals.INSTANT].concat(left);
      const scheduleTifs = [SpecialIntervals.NO_DELAY].concat(left);

      let next = state.data;
      if (value === SpecialIntervals.NO_DELAY) {
        // const tifsLeft = state.data.indexedTifs.map((i) => i.left);

        next = {
          ...state.data,
          pairSelected: -1,
          scheduled: false,
          periodTifs,
          scheduleTifs,
        };
      } else if (value === SpecialIntervals.INSTANT) {
        next = { ...state.data, pairSelected: -2, scheduled: false };
      }

      return { data: next };
    }
    default:
      throw new Error(`Unknown action: ${act?.type}`);
  }
};
