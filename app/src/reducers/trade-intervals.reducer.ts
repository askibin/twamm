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

interface Data {
  indexedTifs: IndexedTIF[];
  minTimeTillExpiration: number;
  optional: {} | OptionalIntervals;
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
  SET_TIFS = "SET_TIFS",
  SET_SCHEDULE = "SET_SCHEDULE",
  SET_PERIOD = "SET_PERIOD",
}

export const defaultState: State = {
  data: undefined,
};

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
  | ReturnType<typeof setTifs>
  | ReturnType<typeof setSchedule>
  | ReturnType<typeof setPeriod>;

export const action = { setTifs, setSchedule, setPeriod };

export default (
  state: State | State<Data>,
  act: Action
): State | State<Data> => {
  switch (act?.type) {
    case ActionTypes.SET_TIFS: {
      const {
        indexedTifs,
        minTimeTillExpiration,
        optionalIntervals,
        selectedTif,
      } = act.payload as ActionPayload<typeof setTifs>;

      const availableTifs: IndexedTIF[] = indexedTifs
        .filter(byActivePool)
        .filter((t) => byExpirationTime(t, minTimeTillExpiration));

      const tifsLeft = availableTifs.map((d) => d.left);
      const tifs = availableTifs.map((d) => d.tif);

      let periodTifs;
      let scheduledTif;

      const tif = selectedTif ? selectedTif[1] : SpecialIntervals.NO_DELAY; // ensure that NO_DELAY is used
      const pairSelected: SelectedTIF = selectedTif;

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
