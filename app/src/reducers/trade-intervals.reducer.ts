const SET_TIFS = "SET_TIFS";

const SET_SCHEDULE = "SET_SCHEDULE";

const SET_PERIOD = "SET_PERIOD";

const CLEAR_TIFS = "CLEAR_TIFS";

const noDelayTif = -1;

interface State {
  periodTifs: number[] | undefined;
  scheduleTifs: number[] | undefined;
  tifs: number[] | undefined;
  tifScheduled: number | undefined;
  tifSelected: number | undefined;
  tifsLeft: number[] | undefined;
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

export default <S extends State, A extends Action<any>>(
  state: S,
  action: A
) => {
  if (!action) return state;

  switch (action.type) {
    case CLEAR_TIFS: {
      const { tifs, tifsLeft } = action.payload;

      return {
        periodTifs: tifsLeft,
        scheduleTifs: tifsLeft,
        tifs,
        tifScheduled: noDelayTif,
        tifSelected: undefined,
        tifsLeft,
      };
    }

    case SET_TIFS: {
      const { tifs, tifsLeft } = action.payload;
      return {
        periodTifs: tifsLeft,
        scheduleTifs: [noDelayTif].concat(tifsLeft),
        tifs,
        tifScheduled: noDelayTif,
        tifSelected: undefined,
        tifsLeft,
      };
    }

    case SET_SCHEDULE: {
      const { tif } = action.payload;

      return {
        tifs: state.tifs,
        tifsLeft: state.tifsLeft,
        tifSelected: undefined,
        tifScheduled: tif,
        periodTifs: state.tifsLeft,
        scheduleTifs: [noDelayTif].concat(state.tifsLeft ?? []),
      };
    }

    case SET_PERIOD: {
      const { tif } = action.payload;

      return { ...state, tifSelected: tif };
    }

    default: {
      return state;
    }
  }
};

const clearTifs = (payload: { tifs: number[]; tifsLeft: number[] }) => ({
  type: CLEAR_TIFS,
  payload,
});

const setTifs = (payload: { tifs: number[]; tifsLeft: number[] }) => ({
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
