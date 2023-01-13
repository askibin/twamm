import type { IndexedTIF } from "../domain/interval.d";

export enum SpecialIntervals {
  NO_DELAY = -1,
  INSTANT = -2,
}

export type OptionalIntervals = {
  [key: number]: IndexedTIF[];
};
