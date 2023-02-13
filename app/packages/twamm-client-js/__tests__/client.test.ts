console.log("FIX tests");
import type { Pool, TokenPair } from "@twamm/types";
import { BN } from "@project-serum/anchor";
import { lensPath, set } from "ramda";
import { quantity, filledQuantity } from "../lib/protocol";

describe("client.js | protocol", () => {
  const pair = {
    configA: {
      decimals: 6,
    },
  } as TokenPair;

  const pool = {
    sellSide: {
      lpSupply: new BN(0),
      fillsVolume: new BN(0),
    },
  } as Pool;

  const orderType = { sell: {} } as OrderTypeStruct;

  it("should calc quantity", () => {
    expect(quantity(pair, orderType, new BN(0))).toEqual(0);
    expect(quantity(pair, orderType, new BN(100000))).toEqual(0.1);
  });
  it("should calc filledQuantity", () => {
    const fq = (a: number) =>
      set(lensPath(["sellSide", "fillsVolume"]), new BN(a), pool);

    expect(filledQuantity(pair, pool, orderType)).toEqual(0);
    expect(filledQuantity(pair, fq(100000), orderType)).toEqual(0.1);
  });
});
