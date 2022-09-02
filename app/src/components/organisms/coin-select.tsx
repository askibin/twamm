import Box from "@mui/material/Box";
import { useMemo } from "react";

import CoinSelect from "../molecules/coin-select";
import CoinTags from "../molecules/coin-tags";
import styles from "./coin-select.module.css";
import { useCoins } from "../../hooks/use-coins";

export interface Props {}

const STARRED_COINS = ["usdt", "usdc", "sol", "ray", "dai", "busd"];

export default function (props: Props) {
  const { data, error, isValidating } = useCoins();

  const coinRecords = useMemo(() => {
    if (!data) return {};

    return data;
  }, [data]);

  const starredCoins = STARRED_COINS.map(
    (symbol) => coinRecords[symbol]
  ).filter((c) => c);

  return (
    <Box className={styles.root}>
      <div>seelct</div>
      <CoinTags className={styles.starredCoins} coins={starredCoins} />
      <CoinSelect coins={coinRecords} />
    </Box>
  );
}
