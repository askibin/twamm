import { flatten } from "ramda";

const CLEAR = "CLEAR";

const CLEAR_A = "CLEAR_A";

const CLEAR_ALL = "CLEAR_ALL";

const INIT = "INIT";

const SELECT_A = "SELECT_A";

const SELECT_B = "SELECT_B";

const SWAP = "SWAP";

interface State {
  a?: TokenInfo;
  available?: string[];
  b?: TokenInfo;
  cancellable?: string[];
  pairs?: AddressPair[];
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

const clearAll = (payload = {}) => ({
  type: CLEAR_ALL,
  payload,
});

const init = (payload: { pairs: AddressPair[] }) => ({
  type: INIT,
  payload,
});

const selectA = (payload: { token: TokenInfo }) => ({
  type: SELECT_A,
  payload,
});

const selectB = (payload: { token: TokenInfo }) => ({
  type: SELECT_B,
  payload,
});

const swap = (payload = {}) => ({
  type: SWAP,
  payload,
});

const flattenPairs = (pairs: AddressPair[]) =>
  Array.from(new Set(flatten(pairs)).values());

const matchPairs = (pair: AddressPair, pairs: AddressPair[]) => {
  const matchedPair = pairs.find(
    (tokenPair) => tokenPair.includes(pair[0]) && tokenPair.includes(pair[1])
  );

  if (!matchedPair) return undefined;

  const type = pair[0] === matchedPair[0] ? "sell" : "buy";

  return type;
};

// TODO: cover with tests & better types

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
          available,
          b: undefined,
          cancellable: undefined,
          type: undefined,
        };

      if (isB) return { ...state, b: undefined, type: undefined };

      return state;
    }

    case SELECT_A: {
      const {
        payload: { token },
      } = action as Action<ActionPayload<typeof selectA>>;
      const { b, pairs = [] } = state;

      const available = flatten(
        pairs.filter((pair) => pair.includes(token.address))
      ).filter((pairToken) => token.address !== pairToken);

      const cancellable = [token.address];

      const shouldClearOpposite = b && token.address === b.address;

      let type;
      if (b && !shouldClearOpposite) {
        const pair: AddressPair = [token.address, b.address];
        type = matchPairs(pair, pairs);
      }

      return {
        ...state,
        a: token,
        b: shouldClearOpposite ? undefined : b,
        available,
        cancellable,
        type,
      };
    }

    case SELECT_B: {
      const {
        payload: { token },
      } = action as Action<ActionPayload<typeof selectB>>;
      const { a, pairs = [] } = state;

      let type;
      if (a) {
        const pair: AddressPair = [a.address, token.address];
        type = matchPairs(pair, pairs);
      }

      return { ...state, b: token, type };
    }

    case CLEAR_A: {
      const pairs = state.pairs ?? [];
      const available = flattenPairs(pairs);

      return {
        ...state,
        b: undefined,
        a: undefined,
        available,
        type: undefined,
      };
    }

    case CLEAR_ALL: {
      return { ...initialState };
    }

    case SWAP: {
      const { a, b, type } = state;

      return {
        ...state,
        a: b,
        b: a,
        cancellable: b?.address ? [b.address] : undefined,
        type: type === "sell" ? "buy" : "sell",
      };
    }

    default: {
      return state;
    }
  }
};

export const action = { clearAll, clear, init, selectA, selectB, swap };
