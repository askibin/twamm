const CLEAR_A = "CLEAR_A";

const INIT = "INIT";

const SELECT_A = "SELECT_A";

const SWAP = "SWAP";

interface State {
  a?: JupToken;
  b?: JupToken;
  type?: OrderType;
  available?: string[];
  selected?: string[];
}

export const initialState = {
  a: undefined,
  b: undefined,
  type: undefined,
  available: undefined,
  selected: undefined,
};

export default <S extends Partial<State>, A extends Action<any>>(
  state: S,
  action: A
) => {
  if (!action) return state;

  console.log("act", action);

  switch (action.type) {
    case INIT: {
      const available = action.payload;

      console.log("stavailable", available);

      return { ...state, available };
    }

    //case SWAP: {
    //const { a, b, type } = state;

    //return { a: b, b: a, type: type === "sell" ? "buy" : "sell" };
    //}

    //case SELECT_A: {
    //const { address, symbol } = action.payload;

    //console.log({ address, symbol });

    //return state;
    //}

    default: {
      return state;
    }
  }
};

const clearA = (payload = {}) => ({
  type: CLEAR_A,
  payload,
});

const init = (payload: { pair: TokenPair[] }) => ({
  type: INIT,
  payload,
});

const selectA = (payload: { token: JupToken }) => ({
  type: SELECT_A,
  payload,
});

const swap = (payload = {}) => ({
  type: SWAP,
  payload,
});

export const action = { clearA, init, selectA, swap };
