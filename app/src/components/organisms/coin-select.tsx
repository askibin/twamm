import type { ChangeEvent, MouseEvent } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { useCallback, useMemo, useState } from "react";

import CoinSelect from "../molecules/coin-select";
import styles from "./coin-select.module.css";
import TokenTags from "../atoms/token-tags";
import { useJupTokensByMint } from "../../hooks/use-jup-tokens-by-mints";

export interface Props {
  tokens?: string[];
  onSelect: (arg0: JupToken) => void;
}

const STARRED_COINS = ["usdt", "usdc", "sol", "ray", "dai"];

export default ({ tokens, onSelect = () => {} }: Props) => {
  // const { data, isValidating } = useCoins();
  // TODO: remove use-coins;
  const [search, setSearch] = useState<string>();

  const { data, isValidating } = useJupTokensByMint(tokens);

  const coinRecords = useMemo(() => {
    if (!data) return {};

    const records: Record<string, any> = {};

    data.forEach((token) => {
      records[token.symbol.toLowerCase()] = {
        ...token,
        image: token.logoURI,
      };
    });

    return records;
  }, [data]);

  const starredCoins = STARRED_COINS.map(
    (symbol) => coinRecords[symbol]
  ).filter((c) => c);

  const onCoinSelect = useCallback(
    (_: MouseEvent, symbol: string) => {
      onSelect(coinRecords[symbol.toLowerCase()]);
    },
    [coinRecords, onSelect]
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
        <TokenTags coins={starredCoins} onClick={onCoinSelect} />
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
