import { flatten, lensPath, pipe, set } from "ramda";
import { OrderSides } from "../types/enums.d";

const flattenPairs = (pairs: AddressPair[]) =>
  Array.from(new Set(flatten(pairs)).values());

const matchPairs = (pair: AddressPair, pairs: AddressPair[]) => {
  const matchedPair = pairs.find(
    (tokenPair) => tokenPair.includes(pair[0]) && tokenPair.includes(pair[1])
  );

  if (!matchedPair) return OrderSides.defaultSide;

  const type = pair[0] === matchedPair[0] ? OrderSides.sell : OrderSides.buy;

  return type;
};

enum ActionTypes {
  WITH_DEFAULT = "WITH_DEFAULT",
  SELECT_A = "SELECT_A",
  SELECT_B = "SELECT_B",
  SWAP = "SWAP",
}

export interface Data {
  a: any; // TokenInfo;
  all: string[];
  available: string[];
  b: any; // TokenInfo;
  cancellable: undefined; // string[];
  pairs: AddressPair[];
  type: OrderType;
}

export interface State<D = undefined> {
  data: D;
}

export const populateInitial = (data = undefined) => ({
  data,
  params: undefined,
  defaults: {
    type: OrderSides.defaultSide,
  },
});

export const defaultState: State = {
  data: undefined,
};

export const initialState = {
  a: undefined,
  all: undefined,
  available: undefined,
  b: undefined,
  cancellable: undefined,
  pairs: undefined,
  type: "sell",
};

const withDefault = (payload: {
  pairs: AddressPair[];
  pair: JupToken[];
  type: OrderType;
}) => ({
  type: ActionTypes.WITH_DEFAULT,
  payload,
});

const selectA = (payload: { token: TokenInfo }) => ({
  type: ActionTypes.SELECT_A,
  payload,
});

const selectB = (payload: { token: TokenInfo }) => ({
  type: ActionTypes.SELECT_B,
  payload,
});

const swap = (payload: { price?: number }) => ({
  type: ActionTypes.SWAP,
  payload,
});

type Action =
  | ReturnType<typeof withDefault>
  | ReturnType<typeof selectA>
  | ReturnType<typeof selectB>
  | ReturnType<typeof swap>;

export default (
  state: State | State<Data>,
  action: Action
): State | State<Data> => {
  switch (action?.type) {
    case ActionTypes.WITH_DEFAULT: {
      if (state.data) return state;

      const { pair, pairs, type } = action.payload as ActionPayload<
        typeof withDefault
      >;

      const available = flattenPairs(pairs);

      const isChangingType = OrderSides.defaultSide !== type;

      const [a, b] = isChangingType ? [pair[1], pair[0]] : [pair[0], pair[1]];

      const next = {
        a,
        all: available,
        available,
        b,
        cancellable: undefined,
        pairs,
        type,
      };

      return { data: next };
    }
    case ActionTypes.SELECT_A: {
      if (!state.data) return state;

      const lensA = lensPath(["data", "a"]);
      const lensAvailable = lensPath(["data", "available"]);
      const lensB = lensPath(["data", "b"]);
      const lensType = lensPath(["data", "type"]);

      const { a, b, pairs, type } = state.data;
      const { token } = action.payload as ActionPayload<typeof selectA>;

      if (token.address === b?.address) {
        // swap the tokens when oppisite token is selected as lead
        const applyState = pipe(
          set(lensA, b),
          set(lensB, a),
          set(
            lensType,
            type === OrderSides.sell ? OrderSides.buy : OrderSides.sell
          )
        );

        return applyState(state);
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

      if (shouldResetB) {
        // set the lead token and cleanup slave one as it does not match the available pairs
        const applyState = pipe(
          set(lensA, token),
          set(lensB, undefined),
          set(lensAvailable, available),
          set(lensType, OrderSides.defaultSide)
        );

        return applyState(state);
      }

      let nextType;
      if (b && !shouldResetB) {
        const pair: AddressPair = [token.address, b.address];
        nextType = matchPairs(pair, pairs);
      }

      const nextState = {
        data: {
          ...state.data,
          a: token,
          b: shouldResetB ? undefined : b,
          available,
          type: nextType || type,
        },
      };

      return nextState;
    }
    case ActionTypes.SELECT_B: {
      if (!state.data) return state;

      const { a, pairs } = state.data;
      const { token } = action.payload as ActionPayload<typeof selectB>;

      let type = OrderSides.defaultSide;
      if (a) {
        const pair: AddressPair = [a.address, token.address];
        type = matchPairs(pair, pairs);
      }

      const applyState = pipe(
        set(lensPath(["data", "b"]), token),
        set(lensPath(["data", "type"]), type)
      );

      return applyState(state);
    }
    case ActionTypes.SWAP: {
      if (!state.data) return state;

      const { a, b, type } = state.data;

      const applyState = pipe(
        set(lensPath(["data", "a"]), b),
        set(lensPath(["data", "b"]), a),
        set(
          lensPath(["data", "type"]),
          type === OrderSides.sell ? OrderSides.buy : OrderSides.sell
        )
      );

      return applyState(state);
    }
    default:
      throw new Error(`Unknown action: ${action?.type}`);
  }
};

export const action = {
  withDefault,
  init: withDefault,
  selectA,
  selectB,
  swap,
};
