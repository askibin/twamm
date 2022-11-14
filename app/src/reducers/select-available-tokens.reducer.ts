import { flatten } from "ramda";

const INIT_WITH_DEFAULT = "INIT_WITH_DEFAULT";

const SELECT_A = "SELECT_A";

const SELECT_B = "SELECT_B";

const SWAP = "SWAP";

interface State {
  a: any; // TokenInfo;
  all: string[];
  available: string[];
  b: any; // TokenInfo;
  cancellable: string[];
  pairs: AddressPair[];
  type: any; // OrderType;
}

export const initialState = {
  a: undefined,
  all: undefined,
  available: undefined,
  b: undefined,
  cancellable: undefined,
  pairs: undefined,
  type: "sell",
};

const initWithDefault = (payload: {
  pairs: AddressPair[];
  pair: JupTokenData[];
  type: OrderType;
}) => ({
  type: INIT_WITH_DEFAULT,
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

type Payload = any;
/*
 *| Parameters<typeof selectA>[0]
 *| Parameters<typeof selectB>[0]
 *| Parameters<typeof swap>[0]
 *| Parameters<typeof initWithDefault>[0];
 */

export default <S extends Partial<State>, A extends Action<Payload>>(
  state: S,
  action: A
) => {
  if (!action) return state;

  switch (action.type) {
    case INIT_WITH_DEFAULT: {
      const {
        payload: { pair, pairs, type },
      } = action as Action<ActionPayload<typeof initWithDefault>>;
      const available = flattenPairs(pairs);
      const { a: prevA, b: prevB, type: prevType } = state;

      if (prevA && prevB) return state;

      const isChangingType = prevType !== type;

      const nextState = {
        ...initialState,
        a: isChangingType ? pair[1] : pair[0],
        b: isChangingType ? pair[0] : pair[1],
        available,
        all: available,
        pairs,
        type,
      };

      return nextState;
    }

    case SELECT_A: {
      const {
        payload: { token },
      } = action as Action<ActionPayload<typeof selectA>>;
      const { a, b, pairs = [], type: t } = state;

      if (token.address === b?.address) {
        return {
          ...state,
          a: b,
          b: a,
          type: t === "sell" ? "buy" : "sell",
        };
      }

      // Allow to select every token for A
      // Cleanup present b if does not match the pair

      const availablePairs = pairs.filter((pair) =>
        pair.includes(token.address)
      );

      const available = flatten(availablePairs).filter(
        (pairToken) => pairToken !== token.address
      );

      const shouldResetB = b && !available.includes(b.address);

      let nextType;
      if (b && !shouldResetB) {
        const pair: AddressPair = [token.address, b.address];
        nextType = matchPairs(pair, pairs);
      }

      const nextState = {
        ...state,
        a: token,
        b: shouldResetB ? undefined : b,
        available,
        type: nextType || t,
      };

      return nextState;
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

      const nextState = {
        ...state,
        b: token,
        type,
      };

      return nextState;
    }

    case SWAP: {
      const { a, b, type } = state;

      return {
        ...state,
        a: b,
        b: a,
        type: type === "sell" ? "buy" : "sell",
      };
    }

    default: {
      return state;
    }
  }
};

export const action = {
  initWithDefault,
  selectA,
  selectB,
  swap,
};
