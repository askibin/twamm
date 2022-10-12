const SET_TIFS = "SET_TIFS";

const SET_SCHEDULE = "SET_SCHEDULE";

const SET_PERIOD = "SET_PERIOD";

const noDelayTif = -1;

interface State {
  indexedTifs: IndexedTIF[];
  periodTifs: TIF[];
  scheduleTifs: TIF[];
  tifs: TIF[];
  tifScheduled: number;
  tifSelected: number;
  tifsLeft: TIF[];
}

export const initialState = {
  periodTifs: undefined,
  scheduleTifs: undefined,
  tifScheduled: undefined,
  tifSelected: undefined,
  tifs: undefined,
  tifsLeft: undefined,
};

// TODO: cover with better types & tests

const setTifs = (payload: { indexedTifs: IndexedTIF[] }) => ({
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
      const { indexedTifs }: Parameters<typeof setTifs>[0] = action.payload;

      const tifsLeft = indexedTifs.map((d: IndexedTIF) => d.left);

      return {
        periodTifs: sortTifs(tifsLeft),
        scheduleTifs: sortTifs([noDelayTif].concat(tifsLeft)),
        indexedTifs,
        tifScheduled: noDelayTif,
        tifSelected: undefined,
        tifsLeft,
      };
    }

    case SET_SCHEDULE: {
      const { indexedTifs } = state;
      const { tif }: Parameters<typeof setSchedule>[0] = action.payload;

      const tifsLeft = sortTifs(
        indexedTifs?.map((d: IndexedTIF) => d.left) ?? []
      );

      let periodTifs;
      if (tif === noDelayTif) {
        periodTifs = tifsLeft;
      } else {
        const scheduledTif = indexedTifs?.find((d) => d.left === tif);
        periodTifs = scheduledTif ? [scheduledTif.tif] : [];
      }

      return {
        tifs: state.tifs,
        tifsLeft: state.tifsLeft,
        tifSelected: undefined,
        tifScheduled: tif,
        periodTifs,
        scheduleTifs: [noDelayTif].concat(tifsLeft),
      };
    }

    case SET_PERIOD: {
      const { tif }: Parameters<typeof setPeriod>[0] = action.payload;

      return { ...state, tifSelected: tif };
    }

    default: {
      return state;
    }
  }
};
