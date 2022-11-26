import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

export interface Props {
  interval: number;
  refresh?: boolean;
}

const INTERVAL = 1500;

const calcValue = (a: number, b: number) => Math.round((a / b) * 100);

export default ({ interval, refresh = false }: Props) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const updateInterval = () => {
      if (counter < interval) {
        setCounter(counter + INTERVAL);
      } else {
        setCounter(0);
      }
    };
    const i = setTimeout(updateInterval, INTERVAL);

    if (refresh) setCounter(0);

    return () => {
      if (i) clearTimeout(i);
    };
  }, [counter, interval, refresh]);

  return (
    <CircularProgress
      size={18}
      value={calcValue(counter, interval)}
      variant="determinate"
    />
  );
};
