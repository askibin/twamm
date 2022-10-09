import { flatten, lensProp, pipe, set, view } from "ramda";

const CLEAR = "CLEAR";

const CLEAR_A = "CLEAR_A";

const INIT = "INIT";

const SELECT_A = "SELECT_A";

const SWAP = "SWAP";

interface State {
  a?: JupToken;
  b?: JupToken;
  type?: OrderType;
  available?: string[];
  cancellable?: string[];
  selectable?: TokenPair[];
  selected?: string[];
  pairs?: TokenPair[];
}

export const initialState = {
  a: undefined,
  b: undefined,
  type: undefined,
  available: undefined,
  selected: undefined,
  pairs: undefined,
};

const clear = (payload: { symbol: string }) => ({
  type: CLEAR,
  payload,
});

const clearA = (payload = {}) => ({
  type: CLEAR_A,
  payload,
});

const init = (payload: { pairs: TokenPair[] }) => ({
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

const flattenPairs = (pairs: TokenPair[]) =>
  Array.from(new Set(flatten(pairs)).values());

export default <S extends Partial<State>, A extends Action<any>>(
  state: S,
  action: A
) => {
  if (!action) return state;

  console.log("act", action);

  switch (action.type) {
    case INIT: {
      const {
        payload: { pairs },
      } = action as Action<ActionPayload<typeof init>>;
      const available = flattenPairs(pairs);

      return { ...initialState, available, pairs };
    }

    case CLEAR: {
      const {
        payload: { symbol },
      } = action as Action<ActionPayload<typeof clear>>;
      const pairs = state.pairs ?? [];

      const available = flattenPairs(pairs);

      const isA = state.a?.symbol.toLowerCase() === symbol;
      const isB = state.b?.symbol.toLowerCase() === symbol;

      if (isA)
        return {
          ...state,
          a: undefined,
          b: undefined,
          available,
          cancellable: undefined,
        };

      if (isB) return { ...state, b: undefined };

      return state;
    }

    case SELECT_A: {
      const {
        payload: { token },
      } = action as Action<ActionPayload<typeof selectA>>;
      const pairs = state.pairs ?? [];

      const available = flatten(
        pairs.filter((pair) => pair.includes(token.address))
      ).filter((pairToken) => token.address !== pairToken);

      const cancellable = [token.address];

      return { ...state, a: token, b: undefined, available, cancellable };
    }

    case CLEAR_A: {
      const pairs = state.pairs ?? [];
      const available = flattenPairs(pairs);

      return { ...state, b: undefined, a: undefined, available };
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

export const action = { clear, clearA, init, selectA, swap };
