const SET_TIFS = "SET_TIFS";

const SET_SCHEDULE = "SET_SCHEDULE";

const SET_PERIOD = "SET_PERIOD";

const noDelayTif = -1;

interface State {
  indexedTifs: IndexedTIF[];
  pairSelected: [number | undefined, number | undefined];
  periodTifs: TIF[];
  scheduleTifs: TIF[];
  //tifs: TIF[];
  //tifScheduled: number;
  //tifSelected: number;
  tifsLeft: TIF[];
}

export const initialState = {
  indexedTifs: undefined,
  pairSelected: [undefined, -1],
  periodTifs: undefined,
  scheduleTifs: undefined,
  //tifScheduled: undefined,
  //tifSelected: undefined,
  //tifs: undefined,
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
        indexedTifs,
        pairSelected: initialState.pairSelected,
        periodTifs: sortTifs(tifsLeft),
        scheduleTifs: sortTifs([noDelayTif].concat(tifsLeft)),
        //tifScheduled: noDelayTif,
        //tifSelected: undefined,
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
        //tifs: state.tifs,
        //tifScheduled: tif,
        //tifSelected: undefined,
        tifsLeft: state.tifsLeft,
      };
    }

    case SET_PERIOD: {
      const { pairSelected: selected } = state;
      const { tif }: Parameters<typeof setPeriod>[0] = action.payload;

      const pairSelected = [tif, selected ? selected[1] : undefined];

      console.log("selected", pairSelected);

      return {
        ...state,
        pairSelected,
        // tifSelected: tif
      };
    }

    default: {
      return state;
    }
  }
};
