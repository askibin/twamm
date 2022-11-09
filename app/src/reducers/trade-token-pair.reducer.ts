const ACTION = "action";

export interface State {
  pair: TokenPair<JupToken>;
  side: OrderType;
  a: JupToken;
  b: JupToken;
}

export const initialState = {
  pair: undefined,
  side: undefined,
  a: undefined,
  b: undefined,
};

const setPair = (payload: { pair: TokenPair<JupToken>; side: OrderType }) => ({
  type: ACTION,
  payload,
});

export const action = { setPair };

type Payload = Parameters<typeof setPair>[0];

export default <
  S extends State | typeof initialState,
  A extends Action<Payload>
>(
  state: S,
  action: A // eslint-disable-line @typescript-eslint/no-shadow
) => {
  if (!action) return state;

  switch (action.type) {
    case ACTION: {
      const { pair: prevPair, side: prevSide } = state;
      const { pair, side } = action.payload;

      const isPairChanged =
        !prevPair ||
        prevPair[0].address !== pair[0].address ||
        prevPair[1].address !== pair[1].address;

      const isDirectionChanged = prevSide !== side;

      if (isPairChanged || isDirectionChanged) {
        const next = {
          pair,
          side,
          a: side === "sell" ? pair[0] : pair[1],
          b: side === "sell" ? pair[1] : pair[0],
        };

        return next;
      }

      return state;
    }

    default: {
      return state;
    }
  }
};
