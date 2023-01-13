import type {
  IndexedTIF,
  OptionalIntervals,
  SelectedTIF,
} from "../domain/interval.d";
import { SpecialIntervals } from "../domain/interval.d";

export const sortTifs = (tifs: number[]) => tifs.sort((a, b) => a - b);

export const populateTifs = (
  tif: number,
  tifsLeft: number[],
  indexedTifs: IndexedTIF[],
  optionalIntervals: OptionalIntervals
) => {
  let scheduledTif;
  let periodTifs;

  if (tif === SpecialIntervals.NO_DELAY) {
    periodTifs = tifsLeft;
  } else {
    scheduledTif = indexedTifs.find((t) => t.left === tif);
    periodTifs = scheduledTif ? [scheduledTif.tif] : [];
  }

  const pairSelected: SelectedTIF = scheduledTif
    ? [scheduledTif.tif, tif]
    : [undefined, tif];

  if (pairSelected[1] === SpecialIntervals.NO_DELAY) {
    const optionalTifs = (optionalIntervals[0] ?? []).map((t) => t.tif);
    periodTifs = optionalTifs.concat(periodTifs);
    // enhance periods with optional intervals unless tif was selected
  }

  return { pairSelected, periodTifs };
};
