import type { IndexedTIF, PoolTIF, SelectedTIF } from "../domain/interval.d";
import type { OptionalIntervals } from "./trade-intervals.reducer.d";
import { populateTifs, sortTifs } from "./trade-intervals.reducer.util";
import { SpecialIntervals } from "./trade-intervals.reducer.d";

function byActivePool(poolTif: PoolTIF) {
  const isIndexedTIF = typeof poolTif.poolStatus === "undefined";
  const isActivePool = poolTif.poolStatus && poolTif.poolStatus.active;

  return isIndexedTIF || isActivePool;
}

function byExpirationTime(poolTif: PoolTIF, quota: number = 0) {
  if (poolTif.tif === poolTif.left) return true;
  // skip filtering as this interval does not have underlying pool

  const threshold = quota * poolTif.tif;

  return poolTif.left >= threshold;
}

export interface State {
  indexedTifs: IndexedTIF[];
  minTimeTillExpiration: number;
  optional: {} | OptionalIntervals;
  pairSelected: SelectedTIF;
  periodTifs: TIF[];
  scheduleTifs: TIF[];
  tifsLeft: TIF[];
  tifs: TIF[];
}

export const initialState = {
  indexedTifs: undefined,
  minTimeTillExpiration: 0,
  optional: {},
  pairSelected: [undefined, -1],
  periodTifs: undefined,
  scheduleTifs: undefined,
  tifsLeft: undefined,
  tifs: undefined,
};

enum ActionTypes {
  SET_TIFS = "SET_TIFS",
  SET_SCHEDULE = "SET_SCHEDULE",
  SET_PERIOD = "SET_PERIOD",
}

export const defaultState = initialState;

const setTifs = (payload: {
  indexedTifs: PoolTIF[];
  minTimeTillExpiration: number | undefined;
  optionalIntervals: OptionalIntervals;
  selectedTif: [number | undefined, number | undefined];
}) => ({
  type: ActionTypes.SET_TIFS,
  payload,
});

const setSchedule = (payload: { tif: number }) => ({
  type: ActionTypes.SET_SCHEDULE,
  payload,
});

const setPeriod = (payload: { tif: number }) => ({
  type: ActionTypes.SET_PERIOD,
  payload,
});

type Action =
  | ReturnType<typeof setTifs>
  | ReturnType<typeof setSchedule>
  | ReturnType<typeof setPeriod>;

export const action = { setTifs, setSchedule, setPeriod };

export default (state: typeof initialState | State, act: Action) => {
  switch (act?.type) {
    case ActionTypes.SET_TIFS: {
      const {
        indexedTifs,
        minTimeTillExpiration,
        optionalIntervals,
        selectedTif,
      } = act.payload as ActionPayload<typeof setTifs>;

      const availableTifs = indexedTifs
        .filter(byActivePool)
        .filter((t) => byExpirationTime(t, minTimeTillExpiration));

      const tifsLeft = availableTifs.map((d) => d.left);
      const tifs = availableTifs.map((d) => d.tif);

      let periodTifs;
      let scheduledTif;

      const tif = selectedTif ? selectedTif[1] : SpecialIntervals.NO_DELAY;
      const pairSelected = selectedTif || initialState.pairSelected;

      if (tif === SpecialIntervals.NO_DELAY) {
        periodTifs = tifsLeft;
      } else {
        scheduledTif = availableTifs?.find((d) => d.left === tif);
        periodTifs = scheduledTif ? [scheduledTif.tif] : [];
      }

      if (pairSelected[1] === SpecialIntervals.NO_DELAY) {
        const optionalTifs = (optionalIntervals[0] ?? []).map((i) => i.tif);
        periodTifs = optionalTifs.concat(periodTifs);
      }

      return {
        indexedTifs: availableTifs,
        minTimeTillExpiration:
          minTimeTillExpiration ?? state.minTimeTillExpiration,
        optional: optionalIntervals,
        pairSelected,
        periodTifs: sortTifs(periodTifs),
        scheduleTifs: sortTifs([SpecialIntervals.NO_DELAY].concat(tifsLeft)),
        tifsLeft,
        tifs,
      };
    }
    // TODO: improve action to support setting the schedule by tif index.
    // there might be several intervals with the same amount of time left
    case ActionTypes.SET_SCHEDULE: {
      const { indexedTifs = [], optional, tifsLeft = [] } = state;
      const { tif } = act.payload as ActionPayload<typeof setSchedule>;

      const { pairSelected, periodTifs } = populateTifs(
        tif,
        tifsLeft,
        indexedTifs,
        optional
      );

      return {
        ...state,
        indexedTifs,
        pairSelected,
        periodTifs,
        scheduleTifs: [SpecialIntervals.NO_DELAY].concat(tifsLeft),
        tifsLeft,
      };
    }
    case ActionTypes.SET_PERIOD: {
      const { pairSelected: selected } = state;

      const { tif } = act.payload as ActionPayload<typeof setPeriod>;

      const [, nextTif] = selected;

      return { ...state, pairSelected: [tif, nextTif] };
    }
    default:
      throw new Error(`Unknown action: ${act?.type}`);
  }
};
