const SET_TIFS = "SET_TIFS";

const SET_SCHEDULE = "SET_SCHEDULE";

const SET_PERIOD = "SET_PERIOD";

const noDelayTif = -1;

export interface State {
  indexedTifs: IndexedTIF[];
  pairSelected: [number | undefined, number];
  periodTifs: TIF[];
  scheduleTifs: TIF[];
  tifsLeft: TIF[];
  tifs: TIF[];
}

const selectedPair: [number | undefined, number] = [undefined, -1];

export const initialState = {
  indexedTifs: undefined,
  pairSelected: selectedPair,
  periodTifs: undefined,
  scheduleTifs: undefined,
  tifsLeft: undefined,
  tifs: undefined,
};

// TODO: cover with better types & tests

const setTifs = (payload: {
  indexedTifs: IndexedTIF[];
  selectedTif: [number | undefined, number | undefined];
}) => ({
  type: SET_TIFS,
  payload,
});

const setSchedule = (payload: { tif: number }) => ({
  type: SET_SCHEDULE,
  payload,
});

const setPeriod = (payload: { tif: number }) => ({
  type: SET_PERIOD,
  payload,
});

export const action = { setTifs, setSchedule, setPeriod };

const sortTifs = (tifs: number[]) => tifs.sort((a, b) => a - b);

export default <S extends Partial<State>, A extends Action<any>>(
  state: S,
  action: A // eslint-disable-line @typescript-eslint/no-shadow
) => {
  if (!action) return state;

  switch (action.type) {
    case SET_TIFS: {
      const { indexedTifs, selectedTif }: Parameters<typeof setTifs>[0] =
        action.payload;

      // TODO: fix closed pools
      // const isIntervalEnded = d.left === 0;
      const tifsLeft = indexedTifs.map((d: IndexedTIF) => d.left);
      const tifs = indexedTifs.map((d: IndexedTIF) => d.tif);

      let periodTifs;
      let scheduledTif;
      const tif = selectedTif ? selectedTif[1] : -1;
      if (tif === noDelayTif) {
        periodTifs = tifsLeft;
      } else {
        scheduledTif = indexedTifs?.find((d) => d.left === tif);
        periodTifs = scheduledTif ? [scheduledTif.tif] : [];
      }

      return {
        indexedTifs,
        pairSelected: selectedTif || initialState.pairSelected,
        periodTifs: sortTifs(periodTifs),
        scheduleTifs: sortTifs([noDelayTif].concat(tifsLeft)),
        tifsLeft,
        tifs,
      };
    }

    case SET_SCHEDULE: {
      const { indexedTifs } = state;
      const { tif }: Parameters<typeof setSchedule>[0] = action.payload;

      const tifsLeft = sortTifs(
        indexedTifs?.map((d: IndexedTIF) => d.left) ?? []
      );

      let periodTifs;
      let scheduledTif;
      if (tif === noDelayTif) {
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
        scheduleTifs: [noDelayTif].concat(tifsLeft),
        tifsLeft: state.tifsLeft,
      };
    }

    case SET_PERIOD: {
      const { pairSelected: selected } = state;
      const { tif }: Parameters<typeof setPeriod>[0] = action.payload;

      const pairSelected = [tif, selected ? selected[1] : undefined];

      return { ...state, pairSelected };
    }

    default: {
      return state;
    }
  }
};
