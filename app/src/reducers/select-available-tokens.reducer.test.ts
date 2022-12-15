import { OrderSides } from "../types/enums.d";
import * as R from "./select-available-tokens.reducer";

// TODO: resolve duplicated image & logoURI
const a = {
  address: "address_a",
  decimals: 6,
  image: "path_to_a",
  logoURI: "path_to_a",
  name: "a",
  symbol: "A",
};

const b = {
  address: "address_b",
  decimals: 6,
  image: "path_to_b",
  logoURI: "path_to_b",
  name: "b",
  symbol: "B",
};

const c = {
  address: "address_c",
  decimals: 6,
  image: "path_to_c",
  logoURI: "path_to_c",
  name: "c",
  symbol: "C",
};

const d = {
  address: "address_d",
  decimals: 6,
  image: "path_to_d",
  logoURI: "path_to_d",
  name: "d",
  symbol: "D",
};

describe("select-available-tokens reducer", () => {
  it("should init", () => {
    expect(R.default).toThrowError(/^Unknown action/);
    // @ts-expect-error
    expect(() => R.default(R.defaultState)).toThrowError(/^Unknown action/);
  });

  it("should `INIT`", () => {
    const pairs: AddressPair[] = [
      ["address_a", "address_b"],
      ["address_a", "address_c"],
      ["address_b", "address_c"],
    ];
    const pair = [a, b];

    const next1 = R.default(
      R.defaultState,
      R.action.withDefault({ pairs, pair, type: OrderSides.buy })
    );

    const state1 = {
      data: {
        a: b,
        available: ["address_a", "address_b", "address_c"],
        all: ["address_a", "address_b", "address_c"],
        b: a,
        cancellable: undefined,
        pairs,
        type: OrderSides.buy,
      },
    };

    expect(next1).toStrictEqual(state1);

    const next2 = R.default(
      state1,
      R.action.init({ pairs, pair, type: OrderSides.sell })
    );

    expect(next2).toStrictEqual(state1);
  });

  it("should `SWAP`", () => {
    const state0 = R.default(R.defaultState, R.action.swap({}));
    expect(state0).toStrictEqual(R.defaultState);

    const pairs: AddressPair[] = [
      ["address_a", "address_b"],
      ["address_a", "address_c"],
      ["address_b", "address_c"],
    ];

    const state = {
      data: {
        a: b,
        available: ["address_a", "address_b", "address_c"],
        all: ["address_a", "address_b", "address_c"],
        b: a,
        cancellable: undefined,
        pairs,
        type: OrderSides.buy,
      },
    };

    expect(R.default(state, R.action.swap({}))).toStrictEqual({
      data: {
        a,
        available: ["address_a", "address_b", "address_c"],
        all: ["address_a", "address_b", "address_c"],
        b,
        cancellable: undefined,
        pairs,
        type: OrderSides.sell,
      },
    });
  });

  it("should `SELECT_A`", () => {
    const tokenA = { ...a, image: a.logoURI };
    const tokenB = { ...b, image: b.logoURI };
    const tokenC = { ...c, image: c.logoURI };
    const tokenD = { ...d, image: d.logoURI };

    const state0 = R.default(
      R.defaultState,
      R.action.selectA({ token: tokenA })
    );
    expect(state0).toStrictEqual(R.defaultState);

    const pairs: AddressPair[] = [
      ["address_a", "address_b"],
      ["address_a", "address_c"],
      ["address_b", "address_c"],
    ];

    const state = {
      data: {
        a,
        available: ["address_a", "address_b", "address_c"],
        all: ["address_a", "address_b", "address_c"],
        b,
        cancellable: undefined,
        pairs,
        type: OrderSides.sell,
      },
    };

    // select B as A
    expect(R.default(state, R.action.selectA({ token: tokenB }))).toStrictEqual(
      {
        data: {
          a: b,
          available: ["address_a", "address_b", "address_c"],
          all: ["address_a", "address_b", "address_c"],
          b: a,
          cancellable: undefined,
          pairs,
          type: OrderSides.buy,
        },
      }
    );

    // select C
    const state1 = {
      data: {
        a,
        available: ["address_a", "address_b", "address_c"],
        all: ["address_a", "address_b", "address_c"],
        b,
        cancellable: undefined,
        pairs,
        type: OrderSides.sell,
      },
    };

    expect(
      R.default(state1, R.action.selectA({ token: tokenC }))
    ).toStrictEqual({
      data: {
        a: c,
        available: ["address_a", "address_b"],
        all: ["address_a", "address_b", "address_c"],
        b,
        cancellable: undefined,
        pairs,
        type: OrderSides.buy,
      },
    });
  });

  it("should `SELECT_A` and clean slave token", () => {
    const tokenD = { ...d, image: d.logoURI };

    const pairs: AddressPair[] = [
      ["address_a", "address_b"],
      ["address_a", "address_c"],
      ["address_b", "address_c"],
      ["address_c", "address_d"],
      ["address_d", "address_e"],
    ];

    const state = {
      data: {
        a,
        available: ["address_b", "address_c"],
        all: ["address_a", "address_b", "address_c", "address_d", "address_e"],
        b,
        cancellable: undefined,
        pairs,
        type: OrderSides.sell,
      },
    };

    expect(R.default(state, R.action.selectA({ token: tokenD }))).toStrictEqual(
      {
        data: {
          a: d,
          available: ["address_c", "address_e"],
          all: [
            "address_a",
            "address_b",
            "address_c",
            "address_d",
            "address_e",
          ],
          b: undefined,
          cancellable: undefined,
          pairs,
          type: OrderSides.defaultSide,
        },
      }
    );
  });

  it("should `SELECT_B`", () => {
    const tokenA = { ...a, image: a.logoURI };
    const tokenC = { ...c, image: c.logoURI };

    const state0 = R.default(
      R.defaultState,
      R.action.selectB({ token: tokenA })
    );
    expect(state0).toStrictEqual(R.defaultState);

    const pairs: AddressPair[] = [
      ["address_a", "address_b"],
      ["address_a", "address_c"],
      ["address_b", "address_c"],
    ];

    const state = {
      data: {
        a,
        available: ["address_a", "address_b", "address_c"],
        all: ["address_a", "address_b", "address_c"],
        b,
        cancellable: undefined,
        pairs,
        type: OrderSides.sell,
      },
    };
    expect(R.default(state, R.action.selectB({ token: tokenC }))).toStrictEqual(
      {
        data: {
          a,
          available: ["address_a", "address_b", "address_c"],
          all: ["address_a", "address_b", "address_c"],
          b: c,
          cancellable: undefined,
          pairs,
          type: OrderSides.sell,
        },
      }
    );
  });
});
