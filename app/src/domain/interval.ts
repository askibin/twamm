import type { OptionalIntervals } from "./interval.d";
import { SpecialIntervals } from "./interval.d";

export const optionalIntervals: OptionalIntervals = {
  0: [
    {
      tif: SpecialIntervals.INSTANT,
      index: -2,
      left: SpecialIntervals.INSTANT,
    },
  ],
};
