import { BN } from "@project-serum/anchor";
import { lensPath, set } from "ramda";
import { quantity, filledQuantity } from "./order-details";

describe("order-details", () => {
  const pair = {
    configA: {
      decimals: 6,
    },
  } as TokenPairProgramData;

  const pool = {
    sellSide: {
      lpSupply: new BN(0),
      fillsVolume: new BN(0),
    },
  } as PoolData;

  const orderType = { sell: {} } as OrderTypeStruct;

  it("quantity", () => {
    const q = (a: number) =>
      set(lensPath(["sellSide", "lpSupply"]), new BN(a), pool);

    expect(quantity(pair, pool, orderType, new BN(0))).toEqual(0);
    expect(quantity(pair, q(100000), orderType, new BN(100000))).toEqual(0.1);
  });
  it("filledQuantity", () => {
    const fq = (a: number) =>
      set(lensPath(["sellSide", "fillsVolume"]), new BN(a), pool);

    expect(filledQuantity(pair, pool, orderType)).toEqual(0);
    expect(filledQuantity(pair, fq(100000), orderType)).toEqual(0.1);
  });
});
