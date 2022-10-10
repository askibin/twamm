import { flatten } from "ramda";

const CLEAR = "CLEAR";

const CLEAR_A = "CLEAR_A";

const INIT = "INIT";

const SELECT_A = "SELECT_A";

const SELECT_B = "SELECT_B";

const SWAP = "SWAP";

interface State {
  a?: JupToken;
  available?: string[];
  b?: JupToken;
  cancellable?: string[];
  pairs?: TokenPair[];
  type?: OrderType;
}

export const initialState = {
  a: undefined,
  available: undefined,
  b: undefined,
  cancellable: undefined,
  pairs: undefined,
  type: undefined,
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

const selectB = (payload: { token: JupToken }) => ({
  type: SELECT_B,
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

      return { ...state, a: token, available, cancellable };
    }

    case SELECT_B: {
      const {
        payload: { token },
      } = action as Action<ActionPayload<typeof selectB>>;

      return { ...state, b: token };
    }

    case CLEAR_A: {
      const pairs = state.pairs ?? [];
      const available = flattenPairs(pairs);

      return { ...state, b: undefined, a: undefined, available };
    }

    default: {
      return state;
    }
  }
};

export const action = { clear, clearA, init, selectA, selectB, swap };
