import reducer, { action, initialState } from "./trade-intervals.reducer";

describe("trade-intervals", () => {
  it("should init", () => {
    const pairTifs = [1, 2, 3];

    expect(
      reducer(
        initialState,
        action.setTifs({
          indexedTifs: pairTifs.map((tif, index) => ({
            tif,
            left: tif,
            index,
          })),
        })
      )
    ).toEqual({
      indexedTifs: [
        { tif: 1, left: 1, index: 0 },
        { tif: 2, left: 2, index: 1 },
        { tif: 3, left: 3, index: 2 },
      ],
      periodTifs: [1, 2, 3],
      scheduleTifs: [-1, 1, 2, 3],
      tifsLeft: [1, 2, 3],
    });
  });

  it("should change intervals", () => {
    const state = {
      periodTifs: [1, 2, 3],
      scheduleTifs: [-1, 2, 3, 4],
      tifsLeft: [1, 2, 3],
    };

    expect(reducer(state, action.setPeriod({ tif: 2 }))).toEqual({
      ...state,
    });
  });
});
