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
  readonly pairSelected?: number | IndexedTIF;
  readonly periodTifs?: TIF[];
  readonly scheduleTifs?: TIF[];
  readonly setIntervals: (i?: IndexedTIF[]) => void;
  readonly setOptions: (o: { minTimeTillExpiration: number }) => void;
  readonly setTif: (e: ExecuteTIF, s: ScheduleTIF) => void;
  readonly tif: CurrentTIF;
  readonly tifs: IndexedTIF[];
};

export const Context = createContext<TIFContext | undefined>(undefined);

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [, setIntervals] = useState<IndexedTIF[] | undefined>();
  const [options, setOptions] = useState<{ minTimeTillExpiration: number }>({
    minTimeTillExpiration: 0,
  });
  const [tif] = useState<CurrentTIF>({
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
        case 0: {
          dispatch(A.setTif({ value: 0 }));
          break;
        }

        case SpecialIntervals.NO_DELAY:
        case SpecialIntervals.INSTANT:
          dispatch(A.setTif({ value: execute }));
          break;

        default: {
          if (schedule) {
            dispatch(A.setSchedule(execute));
          } else {
            dispatch(A.setPeriod(execute));
          }
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

        dispatch(
          A.setTifs({
            indexedTifs,
            minTimeTillExpiration: options.minTimeTillExpiration,
            optionalIntervals,
            selectedTif: [tif.execute, tif.schedule],
          })
        );
      }
    },
    [dispatch, options, tif]
  );

  const contextValue = useMemo(
    () => ({
      data: state.data,
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
