import type { ChangeEvent, MouseEvent } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { useCallback, useMemo, useState } from "react";

import CoinSelect from "../molecules/coin-select";
import CoinTags from "../molecules/coin-tags";
import styles from "./coin-select.module.css";
import { useCoins } from "../../hooks/use-coins";

export interface Props {
  onSelect: (arg0: string) => void;
}

const STARRED_COINS = ["usdt", "usdc", "sol", "ray", "dai", "busd"];

export default ({ onSelect = () => {} }: Props) => {
  const { data, isValidating } = useCoins();
  const [search, setSearch] = useState<string>();

  const coinRecords = useMemo(() => {
    if (!data) return {};

    return data;
  }, [data]);

  const starredCoins = STARRED_COINS.map(
    (symbol) => coinRecords[symbol]
  ).filter((c) => c);

  const onCoinSelect = useCallback(
    (_: MouseEvent, symbol: string) => {
      onSelect(symbol);
    },
    [onSelect]
  );

  const onSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSearch(value.toLowerCase());
  }, []);

  const isLoading = !data && isValidating;

  return (
    <Box className={styles.root}>
      {isLoading && <CircularProgress />}
      <Box p={2}>
        <TextField
          fullWidth
          label="Search coin"
          onChange={onSearch}
          variant="standard"
          InputProps={{
            endAdornment: (
              <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            ),
          }}
        />
      </Box>
      <Box px={2} pb={1}>
        <CoinTags coins={starredCoins} onClick={onCoinSelect} />
      </Box>
      <Divider />
      <CoinSelect
        coins={coinRecords}
        filterCoin={search}
        onClick={onCoinSelect}
      />
    </Box>
  );
};
