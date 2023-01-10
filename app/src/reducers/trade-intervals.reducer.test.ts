import reducer, { action, initialState } from "./trade-intervals.reducer";

const populateIndexedTIFs = (tifs: TIF[], left = []) =>
  tifs.map((tif, index) => ({
    tif,
    left: left[index] ?? tif,
    index,
  }));

describe("trade-intervals", () => {
  it.skip("should init", () => {
    const pairTifs = [1, 2, 3];

    expect(
      reducer(
        initialState,
        action.setTifs({
          indexedTifs: populateIndexedTIFs(pairTifs),
          selectedTif: [undefined, -1],
        })
      )
    ).toEqual({
      indexedTifs: [
        { tif: 1, left: 1, index: 0 },
        { tif: 2, left: 2, index: 1 },
        { tif: 3, left: 3, index: 2 },
      ],
      pairSelected: [undefined, -1],
      periodTifs: [1, 2, 3],
      scheduleTifs: [-1, 1, 2, 3],
      tifs: [1, 2, 3],
      tifsLeft: [1, 2, 3],
    });
  });

  it.skip("should change intervals", () => {
    const pairSelected: [number | undefined, number] = [undefined, -1];
    const state = {
      indexedTifs: populateIndexedTIFs([1, 2, 3]),
      pairSelected,
      scheduleTifs: [-1, 2, 3, 4],
      periodTifs: [1, 2, 3],
      tifs: [1, 2, 3],
      tifsLeft: [1, 2, 3],
    };

    expect(reducer(state, action.setPeriod({ tif: 2 }))).toEqual({
      indexedTifs: populateIndexedTIFs([1, 2, 3]),
      pairSelected: [2, -1],
      periodTifs: [1, 2, 3],
      scheduleTifs: [-1, 2, 3, 4],
      tifs: [1, 2, 3],
      tifsLeft: [1, 2, 3],
    });
  });
});
