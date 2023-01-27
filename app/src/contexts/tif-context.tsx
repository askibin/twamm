import type { FC, ReactNode } from "react";
import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
} from "react";
import type { IndexedTIF } from "../domain/interval.d";
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
  const [tif, setTif] = useState<CurrentTIF>({
    execute: SpecialIntervals.NO_DELAY,
    schedule: false,
  });

  const changeTif = useCallback(
    (execute: ExecuteTIF, schedule: ScheduleTIF) => {
      switch (execute) {
        case SpecialIntervals.NO_DELAY: {
          setTif({ execute: SpecialIntervals.NO_DELAY, schedule: false });
          break;
        }
        case SpecialIntervals.INSTANT: {
          setTif({ execute: SpecialIntervals.NO_DELAY, schedule: false });
          break;
        }
        default: {
          setTif({ execute, schedule });
        }
      }
    },
    [tif]
  );

  const contextValue = useMemo(
    () => ({
      setTif: changeTif,
      tif,
    }),
    [changeTif, tif]
  );

  console.log("TOF2.0", tif);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("Tif context required");
  }

  return context;
};
