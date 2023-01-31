import type { FC, ReactNode } from "react";
import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
} from "react";
import type { IndexedTIF } from "../domain/interval.d";
import useTradeIntervals, { action as A } from "../hooks/use-trade-intervals";
import { optionalIntervals } from "../domain/interval";
import { SpecialIntervals } from "../domain/interval.d";

type ScheduleTIF = boolean;

type ExecuteTIF =
  | IndexedTIF
  | SpecialIntervals.NO_DELAY
  | SpecialIntervals.INSTANT;

type CurrentTIF = {
  execute: ExecuteTIF;
  schedule: ScheduleTIF;
};

export type TIFContext = {
  readonly setTif: (e: ExecuteTIF, s: ScheduleTIF) => void;
  readonly tif: CurrentTIF;
};

export const Context = createContext<TIFContext | undefined>(undefined);

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [intervals, setIntervals] = useState<IndexedTIF[] | undefined>();
  const [options, setOptions] = useState<{ minTimeTillExpiration: number }>({
    minTimeTillExpiration: 0,
  });
  const [tif, setTif] = useState<CurrentTIF>({
    execute: SpecialIntervals.NO_DELAY,
    schedule: false,
  });

  const [state, dispatch] = useTradeIntervals(undefined, true);

  const changeOptions = useCallback(
    (opts: { minTimeTillExpiration: number }) => {
      setOptions(opts);
    },
    []
  );

  const changeTif = useCallback(
    (execute: ExecuteTIF, schedule: ScheduleTIF) => {
      switch (execute) {
        case SpecialIntervals.NO_DELAY: {
          // setTif({ execute: SpecialIntervals.NO_DELAY, schedule: false });
          break;
        }
        case SpecialIntervals.INSTANT: {
          console.log("STT A", execute, schedule);

          // setTif({ execute: SpecialIntervals.INSTANT, schedule: false });
          break;
        }
        default: {
          if (schedule) {
            dispatch(A.setSchedule(execute));
          } else {
            dispatch(A.setPeriod(execute));
          }

          // setTif({ execute, schedule });
        }
      }
    },
    [dispatch]
  );

  const changeIntervals = useCallback(
    (indexedTifs: IndexedTIF[] | undefined) => {
      // TODO: consider using comparing method to reduce the number of updates;
      if (indexedTifs) {
        setIntervals(indexedTifs);

        console.log("STT A", tif.execute, tif.schedule);

        dispatch(
          A.setTifs({
            indexedTifs,
            minTimeTillExpiration: options.minTimeTillExpiration,
            optionalIntervals,
            selectedTif: [tif.execute, tif.schedule],
          })
        );

        console.log("STT", state);
      }
    },
    [dispatch, options, tif]
  );

  const contextValue = useMemo(
    () => ({
      pairSelected: state.data?.pairSelected,
      periodTifs: state.data?.periodTifs,
      scheduleTifs: state.data?.scheduleTifs,
      setIntervals: changeIntervals,
      setOptions: changeOptions,
      setTif: changeTif,
      tif,
      tifs: state.data?.indexedTifs,
    }),
    [changeIntervals, changeOptions, changeTif, state, tif]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("Tif context required");
  }

  return context;
};
