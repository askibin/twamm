const sortTifs = (tifs: number[]) => tifs.sort((a, b) => a - b);

export enum SpecialIntervals {
  NO_DELAY = -1,
  INSTANT = -2,
}

export type OptionalIntervals = {
  [key: number]: IndexedTIF[];
};

export const noDelayTif = SpecialIntervals.NO_DELAY;

export const instantTif = SpecialIntervals.INSTANT;

export interface State {
  indexedTifs: IndexedTIF[];
  minTimeTillExpiration: number;
  optional: {} | OptionalIntervals;
  pairSelected: [number | undefined, number];
  periodTifs: TIF[];
  scheduleTifs: TIF[];
  tifsLeft: TIF[];
  tifs: TIF[];
}

const selectedPair: [number | undefined, number] = [undefined, -1];

export const initialState = {
  indexedTifs: undefined,
  minTimeTillExpiration: 0,
  optional: {},
  pairSelected: selectedPair,
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
  indexedTifs: IndexedTIF[];
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
  console.log(state, act);
  switch (act?.type) {
    case ActionTypes.SET_TIFS: {
      const {
        indexedTifs,
        minTimeTillExpiration,
        optionalIntervals,
        selectedTif,
      } = act.payload as ActionPayload<typeof setTifs>;

      // TODO: fix closed pools
      // const isIntervalEnded = d.left === 0;
      const tifsLeft = indexedTifs.map((d: IndexedTIF) => d.left);
      const tifs = indexedTifs.map((d: IndexedTIF) => d.tif);

      let periodTifs;
      let scheduledTif;

      const tif = selectedTif ? selectedTif[1] : -1;
      const pairSelected = selectedTif || initialState.pairSelected;

      if (tif === SpecialIntervals.NO_DELAY) {
        periodTifs = tifsLeft;
      } else {
        scheduledTif = indexedTifs?.find((d) => d.left === tif);
        periodTifs = scheduledTif ? [scheduledTif.tif] : [];
      }

      if (pairSelected[1] === SpecialIntervals.NO_DELAY) {
        const optionalTifs = (optionalIntervals[0] ?? []).map((i) => i.tif);
        periodTifs = optionalTifs.concat(periodTifs);
      }

      return {
        indexedTifs,
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
    case ActionTypes.SET_SCHEDULE: {
      const { indexedTifs, minTimeTillExpiration } = state;
      const { tif } = act.payload as ActionPayload<typeof setSchedule>;

      const tifsLeft = sortTifs(
        indexedTifs?.map((d: IndexedTIF) => {
          // FIXME: remove
          // eslint-disable-next-line
          console.log("INT", d.tif * (minTimeTillExpiration ?? 0), d.left, d);
          if (d.tif * (minTimeTillExpiration ?? 0) >= d.left) return 0;
          // exclude all the intervals with almost expired life

          return d.left;
        }) ?? []
      );

      let periodTifs;
      let scheduledTif;
      if (tif === SpecialIntervals.NO_DELAY) {
        periodTifs = tifsLeft;
      } else {
        scheduledTif = indexedTifs?.find((d) => d.left === tif);
        periodTifs = scheduledTif ? [scheduledTif.tif] : [];
      }

      const pairSelected = [scheduledTif?.tif, tif];

      return {
        indexedTifs,
        pairSelected,
        periodTifs,
        scheduleTifs: [SpecialIntervals.NO_DELAY].concat(tifsLeft),
        tifsLeft: state.tifsLeft,
      };
    }
    case ActionTypes.SET_PERIOD: {
      const { pairSelected: selected } = state;
      const { tif } = act.payload as ActionPayload<typeof setPeriod>;

      const pairSelected = [tif, selected ? selected[1] : undefined];

      return { ...state, pairSelected };
    }
    default:
      throw new Error(`Unknown action: ${act?.type}`);
  }
};
