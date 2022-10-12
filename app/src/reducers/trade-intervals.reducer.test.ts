import reducer, { action } from "./trade-intervals.reducer";

const emptyState = {
  periodTifs: undefined,
  scheduleTifs: undefined,
  tifScheduled: undefined,
  tifSelected: undefined,
  tifsLeft: undefined,
};

describe("trade-intervals", () => {
  it("should init", () => {
    const initialState = emptyState;

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
      tifScheduled: -1,
      tifSelected: undefined,
      tifsLeft: [1, 2, 3],
    });
  });

  it("should change intervals", () => {
    const initialState = {
      periodTifs: [1, 2, 3],
      scheduleTifs: [-1, 2, 3, 4],
      tifScheduled: -1,
      tifSelected: undefined,
      tifsLeft: [1, 2, 3],
    };

    expect(reducer(initialState, action.setPeriod({ tif: 2 }))).toEqual({
      ...initialState,
      tifSelected: 2,
    });
  });
});
