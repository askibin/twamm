import reducer, { action } from "./trade-intervals.reducer";

const emptyState = {
  periodTifs: undefined,
  scheduleTifs: undefined,
  tifScheduled: undefined,
  tifSelected: undefined,
  tifs: undefined,
  tifsLeft: undefined,
};

describe("trade-intervals", () => {
  it("should init", () => {
    const initialState = emptyState;

    const pairTifs = [1, 2, 3];

    expect(reducer(initialState, undefined)).toEqual({});
    expect(
      reducer(
        initialState,
        action.setTifs({ tifs: pairTifs, tifsLeft: pairTifs })
      )
    ).toEqual({
      periodTifs: [1, 2, 3],
      scheduleTifs: [-1, 1, 2, 3],
      tifScheduled: -1,
      tifSelected: undefined,
      tifs: [1, 2, 3],
      tifsLeft: [1, 2, 3],
    });
  });

  it("should change intervals", () => {
    const initialState = {
      periodTifs: [1, 2, 3],
      scheduleTifs: [-1, 2, 3, 4],
      tifScheduled: -1,
      tifSelected: undefined,
      tifs: [1, 2, 3],
      tifsLeft: [1, 2, 3],
    };

    expect(reducer(initialState, action.setPeriod({ tif: 2 }))).toEqual({
      ...initialState,
      tifSelected: 2,
    });
  });
});
