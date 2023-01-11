import * as R from "./trade-intervals.reducer";

const populateIndexedTIFs = (tifs: TIF[], left = []) =>
  tifs.map((tif, index) => ({
    tif,
    left: left[index] ?? tif,
    index,
  }));

describe("trade-intervals reducer", () => {
  it("should fail on unsupported action", () => {
    expect(R.default).toThrowError(/^Unknown action/);
    // @ts-expect-error
    expect(() => R.default(R.defaultState)).toThrowError(/^Unknown action/);
  });

  it("should `SET_TIFS`", () => {
    const pairTifs = [300, 900, 1500];
    const indexedTifs = [
      { tif: 300, left: 300, index: 0 },
      { tif: 900, left: 900, index: 1 },
      { tif: 1500, left: 1500, index: 2 },
    ];

    expect(
      R.default(
        R.defaultState,
        R.action.setTifs({
          indexedTifs: populateIndexedTIFs(pairTifs),
          minTimeTillExpiration: undefined,
          optionalIntervals: {},
          selectedTif: [undefined, -1],
        })
      )
    ).toEqual({
      indexedTifs,
      minTimeTillExpiration: 0,
      optional: {},
      pairSelected: [undefined, -1],
      periodTifs: [300, 900, 1500],
      scheduleTifs: [-1, 300, 900, 1500],
      tifs: pairTifs,
      tifsLeft: [300, 900, 1500],
    });

    expect(
      R.default(
        R.defaultState,
        R.action.setTifs({
          indexedTifs: populateIndexedTIFs(pairTifs),
          minTimeTillExpiration: 0.3,
          optionalIntervals: {
            0: [
              {
                tif: R.SpecialIntervals.INSTANT,
                left: R.SpecialIntervals.INSTANT,
                index: -2,
              },
            ],
          },
          selectedTif: [undefined, -1],
        })
      )
    ).toEqual({
      indexedTifs,
      minTimeTillExpiration: 0.3,
      optional: {
        0: [
          {
            tif: R.SpecialIntervals.INSTANT,
            left: R.SpecialIntervals.INSTANT,
            index: -2,
          },
        ],
      },
      pairSelected: [undefined, -1],
      periodTifs: [R.SpecialIntervals.INSTANT, 300, 900, 1500],
      scheduleTifs: [-1, 300, 900, 1500],
      tifs: [300, 900, 1500],
      tifsLeft: [300, 900, 1500],
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

    expect(R.default(state, R.action.setPeriod({ tif: 2 }))).toEqual({
      indexedTifs: populateIndexedTIFs([1, 2, 3]),
      pairSelected: [2, -1],
      periodTifs: [1, 2, 3],
      scheduleTifs: [-1, 2, 3, 4],
      tifs: [1, 2, 3],
      tifsLeft: [1, 2, 3],
    });
  });
});
