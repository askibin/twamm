import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

export interface Props {
  interval: number;
}

const INTERVAL = 2000;

const calcValue = (a: number, b: number) => Math.round((a / b) * 100);

export default ({ interval }: Props) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const updateInterval = () => {
      if (counter < interval) {
        const nextInterval = counter + INTERVAL;
        setCounter(nextInterval);
      } else {
        setCounter(0);
      }
    };
    const i = setTimeout(updateInterval, INTERVAL);

    return () => {
      if (i) clearTimeout(i);
    };
  }, [counter, interval]);

  return (
    <CircularProgress
      size={18}
      value={calcValue(counter, interval)}
      variant="determinate"
    />
  );
};
