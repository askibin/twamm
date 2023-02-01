import type { PoolTIF } from "../domain/interval.d";
import { SpecialIntervals } from "../domain/interval.d";
import * as R from "./trade-intervals.reducer";

const populateIndexedTIFs = (
  tifs: TIF[],
  left: Array<null | number> = [],
  opts: Array<null | {}> = []
): PoolTIF[] =>
  tifs.map((tif, index) => ({
    tif,
    left: left[index] ?? tif,
    index,
    ...(opts[index] ?? {}),
  }));

const optionalIntervals = {
  0: [
    {
      tif: SpecialIntervals.INSTANT,
      left: SpecialIntervals.INSTANT,
      index: -2,
    },
  ],
};

describe("trade-intervals reducer", () => {
  it("should fail on unsupported action", () => {
    expect(R.default).toThrowError(/^Unknown action/);
    // @ts-expect-error
    expect(() => R.default(R.defaultState)).toThrowError(/^Unknown action/);
  });

  it("should `SET_TIFS`", () => {
    expect(
      R.default(
        R.defaultState,
        R.action.setTifs({
          indexedTifs: populateIndexedTIFs([300, 900, 1500]),
          minTimeTillExpiration: undefined,
          optionalIntervals: {},
          selectedTif: [undefined, -1],
        })
      )
    ).toStrictEqual({
      data: {
        indexedTifs: [
          { tif: 300, left: 300, index: 0 },
          { tif: 900, left: 900, index: 1 },
          { tif: 1500, left: 1500, index: 2 },
        ],
        minTimeTillExpiration: 0,
        optional: {},
        pairSelected: [undefined, -1],
        periodTifs: [300, 900, 1500],
        scheduleTifs: [-1, 300, 900, 1500],
        tifs: [300, 900, 1500],
        tifsLeft: [300, 900, 1500],
      },
    });
  });

  it("should `SET_TIFS` with additional options", () => {
    expect(
      R.default(
        R.defaultState,
        R.action.setTifs({
          indexedTifs: populateIndexedTIFs([300, 900, 1500]),
          minTimeTillExpiration: 0.3,
          optionalIntervals,
          selectedTif: [undefined, -1],
        })
      )
    ).toStrictEqual({
      data: {
        indexedTifs: [
          { tif: 300, left: 300, index: 0 },
          { tif: 900, left: 900, index: 1 },
          { tif: 1500, left: 1500, index: 2 },
        ],
        minTimeTillExpiration: 0.3,
        optional: optionalIntervals,
        pairSelected: [undefined, -1],
        periodTifs: [SpecialIntervals.INSTANT, 300, 900, 1500],
        scheduleTifs: [-1, 300, 900, 1500],
        tifs: [300, 900, 1500],
        tifsLeft: [300, 900, 1500],
      },
    });
  });

  it("should `SET_TIFS` and filter out tifs", () => {
    expect(
      R.default(
        R.defaultState,
        R.action.setTifs({
          indexedTifs: populateIndexedTIFs(
            [300, 900, 1500, 1800, 2100, 2400, 2700],
            [null, null, null, 539, null, null, null],
            [
              null,
              null,
              null,
              null,
              { poolStatus: { inactive: {} } },
              { poolStatus: { active: {} } },
              { poolStatus: { expired: {} } },
            ]
          ),
          minTimeTillExpiration: 0.3,
          optionalIntervals,
          selectedTif: [undefined, -1],
        })
      )
    ).toStrictEqual({
      data: {
        indexedTifs: [
          { tif: 300, left: 300, index: 0 },
          { tif: 900, left: 900, index: 1 },
          { tif: 1500, left: 1500, index: 2 },
          { tif: 2400, left: 2400, index: 5, poolStatus: { active: {} } },
        ],
        minTimeTillExpiration: 0.3,
        optional: optionalIntervals,
        pairSelected: [undefined, -1],
        periodTifs: [SpecialIntervals.INSTANT, 300, 900, 1500, 2400],
        scheduleTifs: [-1, 300, 900, 1500, 2400],
        tifs: [300, 900, 1500, 2400],
        tifsLeft: [300, 900, 1500, 2400],
      },
    });
  });

  it("should `SET_SCHEDULE`", () => {
    const state1 = R.default(
      R.defaultState,
      R.action.setTifs({
        indexedTifs: populateIndexedTIFs([300, 900, 1500], [250, null, null]),
        minTimeTillExpiration: 0,
        optionalIntervals,
        selectedTif: [undefined, -1],
      })
    );
    expect(
      R.default(state1 as R.State, R.action.setSchedule({ tif: 250 }))
    ).toEqual({
      data: {
        indexedTifs: populateIndexedTIFs([300, 900, 1500], [250, null, null]),
        minTimeTillExpiration: 0,
        optional: optionalIntervals,
        pairSelected: [300, 250],
        periodTifs: [300],
        scheduleTifs: [-1, 250, 900, 1500],
        tifs: [300, 900, 1500],
        tifsLeft: [250, 900, 1500],
      },
    });

    const state2 = R.default(
      R.defaultState,
      R.action.setTifs({
        indexedTifs: populateIndexedTIFs([300, 900, 1500], [250, null, null]),
        minTimeTillExpiration: 0,
        optionalIntervals,
        selectedTif: [300, 250],
      })
    );
    expect(
      R.default(state2 as R.State, R.action.setSchedule({ tif: -1 }))
    ).toEqual({
      data: {
        indexedTifs: populateIndexedTIFs([300, 900, 1500], [250, null, null]),
        minTimeTillExpiration: 0,
        optional: optionalIntervals,
        pairSelected: [undefined, -1],
        periodTifs: [SpecialIntervals.INSTANT, 250, 900, 1500],
        scheduleTifs: [-1, 250, 900, 1500],
        tifs: [300, 900, 1500],
        tifsLeft: [250, 900, 1500],
      },
    });
  });

  it("should `SET_PERIOD`", () => {
    const state = R.default(
      R.defaultState,
      R.action.setTifs({
        indexedTifs: populateIndexedTIFs([300, 900, 1500], [250, null, null]),
        minTimeTillExpiration: 0,
        optionalIntervals,
        selectedTif: [undefined, -1],
      })
    );
    expect(
      R.default(state as R.State, R.action.setPeriod({ tif: 250 }))
    ).toEqual({
      data: {
        indexedTifs: populateIndexedTIFs([300, 900, 1500], [250, null, null]),
        minTimeTillExpiration: 0,
        optional: optionalIntervals,
        pairSelected: [250, -1],
        periodTifs: [SpecialIntervals.INSTANT, 250, 900, 1500],
        scheduleTifs: [SpecialIntervals.NO_DELAY, 250, 900, 1500],
        tifs: [300, 900, 1500],
        tifsLeft: [250, 900, 1500],
      },
    });
  });
});

describe("trade-intervals reducer 2.0", () => {
  it("should fail on unsupported action", () => {
    expect(R.reducer2).toThrowError(/^Unknown action/);
    // @ts-expect-error
    expect(() => R.reducer2(R.defaultState)).toThrowError(/^Unknown action/);
  });

  it("should `SET_TIFS`", () => {
    expect(
      R.reducer2(
        R.defaultState,
        R.action.setTifs({
          indexedTifs: populateIndexedTIFs([300, 900, 1500]),
          minTimeTillExpiration: undefined,
          optionalIntervals: {},
          selectedTif: [-1, false],
        })
      )
    ).toStrictEqual({
      data: {
        indexedTifs: [
          { tif: 300, left: 300, index: 0 },
          { tif: 900, left: 900, index: 1 },
          { tif: 1500, left: 1500, index: 2 },
        ],
        minTimeTillExpiration: 0,
        optional: {},
        pairSelected: -1,
        periodTifs: [-2, 300, 900, 1500],
        scheduleTifs: [-1, 300, 900, 1500],
        // tifs: [300, 900, 1500],
        // tifsLeft: [300, 900, 1500],
      },
    });
  });

  it("should `SET_SCHEDULE`", () => {
    const state1 = R.reducer2(
      R.defaultState,
      R.action.setTifs({
        indexedTifs: populateIndexedTIFs([300, 900, 1500], [250, null, null]),
        minTimeTillExpiration: 0,
        optionalIntervals,
        selectedTif: [-1, false],
      })
    );

    expect(
      R.reducer2(
        state1 as R.State,
        R.action.setSchedule({
          tif: 300,
          left: 250,
          index: 0,
        })
      )
    ).toEqual({
      data: {
        indexedTifs: populateIndexedTIFs([300, 900, 1500], [250, null, null]),
        minTimeTillExpiration: 0,
        optional: optionalIntervals,
        pairSelected: { tif: 300, left: 250, index: 0 },
        periodTifs: [300],
        scheduleTifs: [-1, 250, 900, 1500],
        // tifs: [300, 900, 1500],
        // tifsLeft: [250, 900, 1500],
      },
    });
    /*
     *const state2 = R.reducer2(
     *  R.defaultState,
     *  R.action.setTifs({
     *    indexedTifs: populateIndexedTIFs([300, 900, 1500], [250, null, null]),
     *    minTimeTillExpiration: 0,
     *    optionalIntervals,
     *    selectedTif: { tif: 300, left: 250, index:0 },
     *  })
     *);
     *expect(
     *  R.reducer2(state2 as R.State, R.action.setSchedule({ tif: -1 }))
     *).toEqual({
     *  data: {
     *    indexedTifs: populateIndexedTIFs([300, 900, 1500], [250, null, null]),
     *    minTimeTillExpiration: 0,
     *    optional: optionalIntervals,
     *    pairSelected: [undefined, -1],
     *    periodTifs: [SpecialIntervals.INSTANT, 250, 900, 1500],
     *    scheduleTifs: [-1, 250, 900, 1500],
     *    tifs: [300, 900, 1500],
     *    tifsLeft: [250, 900, 1500],
     *  },
     *});
     */
  });
  it("should `SET_PERIOD`", () => {
    const state = R.reducer2(
      R.defaultState,
      R.action.setTifs({
        indexedTifs: populateIndexedTIFs([300, 900, 1500], [250, null, null]),
        minTimeTillExpiration: 0,
        optionalIntervals,
        selectedTif: [-1, false],
      })
    );
    expect(
      R.reducer2(
        state as R.State,
        R.action.setPeriod({ tif: 300, left: 250, index: 0 })
      )
    ).toEqual({
      data: {
        indexedTifs: populateIndexedTIFs([300, 900, 1500], [250, null, null]),
        minTimeTillExpiration: 0,
        optional: optionalIntervals,
        pairSelected: { tif: 300, left: 250, index: 0 },
        periodTifs: [-2, 250, 900, 1500],
        scheduleTifs: [-1, 250, 900, 1500],
        // tifs: [300, 900, 1500],
        // tifsLeft: [250, 900, 1500],
      },
    });
  });
});
