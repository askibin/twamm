import M from "easy-maybe/lib";
import { OrderSide } from "@twamm/types/lib";
import type { IndexedTIF, SelectedTIF } from "./interval.d";
import { SpecialIntervals } from "../reducers/trade-intervals.reducer.d";

export type ValidationErrors = {
  a?: Error;
  b?: Error;
  amount?: Error;
  tif?: Error;
};

export const validate = (
  amount: number,
  tif: SelectedTIF | undefined,
  tokenA: string | undefined,
  tokenB: string | undefined
) => {
  const result: ValidationErrors = {};

  if (!tokenA) result.a = new Error("Required");
  if (!tokenB) result.b = new Error("Required");
  if (!amount) result.amount = new Error("Specify the amount of token");
  if (Number.isNaN(Number(amount)))
    result.amount = new Error("Should be the number");

  if (tif) {
    const [timeInForce, modes] = tif;

    if (!timeInForce && modes !== SpecialIntervals.INSTANT) {
      result.tif = new Error("Should choose the interval");
    }
  } else if (!tif) {
    result.tif = new Error("Should choose the interval");
  }

  return Object.keys(result).length ? result : undefined;
};

export const prepare4Program = (
  timeInForce: TIF | undefined,
  nextPool: number | undefined,
  tifIntervals: IndexedTIF[] | undefined,
  side: OrderSide,
  amount: number,
  decimals: number,
  aMint: string,
  bMint: string,
  tifs: number[],
  poolCounters: any[]
) => {
  if (!timeInForce) throw new Error("Absent tif");

  const usingCurrentPool = nextPool === -1;
  const usingNextPool = Boolean(nextPool && nextPool > 0);

  const finalTif = M.withDefault(
    undefined,
    M.andMap((intervals) => {
      const interval = intervals.find((itif: IndexedTIF) => {
        // if (nextPool !== -1) return itif.tif === timeInForce;
        if (!usingCurrentPool) return itif.tif === timeInForce;
        return itif.left === timeInForce;
      });

      return interval;
    }, M.of(tifIntervals))
  );

  if (!finalTif) throw new Error("Wrong tif");
  if (finalTif.left === 0)
    throw new Error("Can not place order to the closed pool");

  const params = {
    side,
    amount,
    decimals,
    aMint,
    bMint,
    nextPool: usingNextPool, // nextPool && nextPool > 0,
    tifs,
    poolCounters,
    tif: finalTif.tif,
  };

  return params;
};

export const prepare4Jupiter = (
  side: OrderSide,
  amount: number,
  decimals: number,
  aMint: string,
  bMint: string
) => {
  const params = {
    side,
    amount,
    decimals,
    aMint,
    bMint,
  };

  return params;
};
