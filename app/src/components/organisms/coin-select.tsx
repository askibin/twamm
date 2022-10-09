import type { ChangeEvent, MouseEvent } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { useCallback, useMemo, useState } from "react";

import CoinSelect from "../molecules/coin-select";
import TokenTags from "../atoms/token-tags";
import { useJupTokensByMint } from "../../hooks/use-jup-tokens-by-mints";
import * as Styled from "./coin-select.styled";

export interface Props {
  tokens?: string[];
  selected?: string[];
  onSelect: (arg0: JupToken) => void;
  onDelete: (arg0: string) => void;
}

const STARRED_COINS = ["usdt", "usdc", "sol", "ray"];

const populateTokenRecords = (data?: JupToken[]) => {
  if (!data) return {};

  const records: Record<string, JupToken & { image: string }> = {};

  data.forEach((token) => {
    records[token.symbol.toLowerCase()] = {
      ...token,
      image: token.logoURI,
    };
  });

  return records;
};

const Loading = () => <CircularProgress />;

export default ({ onDelete, onSelect, selected, tokens }: Props) => {
  const [search, setSearch] = useState<string>();

  const { data, isLoading } = useJupTokensByMint(tokens);
  const { data: selectedData } = useJupTokensByMint(selected);

  const coinRecords = useMemo(() => populateTokenRecords(data), [data]);
  const selectedRecords = useMemo(
    () => populateTokenRecords(selectedData),
    [selectedData]
  );

  const starredTokens = STARRED_COINS.map(
    (symbol) => coinRecords[symbol]
  ).filter((c) => c);

  const onCoinSelect = useCallback(
    (_: MouseEvent, symbol: string) => {
      onSelect(coinRecords[symbol.toLowerCase()]);
    },
    [coinRecords, onSelect]
  );

  const onCoinDelete = useCallback(
    (_: MouseEvent, symbol: string) => {
      onDelete(symbol);
    },
    [onDelete]
  );

  const onSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setSearch(value.toLowerCase());
  }, []);

  return (
    <Styled.Container>
      {isLoading && <Loading />}
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
      <Styled.Tags px={2} pb={1}>
        <TokenTags
          coins={Object.values(selectedRecords)}
          onClick={onCoinDelete}
          deletable
        />
        <TokenTags coins={starredTokens} onClick={onCoinSelect} />
      </Styled.Tags>
      <Divider />
      <CoinSelect
        coins={coinRecords}
        filterCoin={search}
        onClick={onCoinSelect}
      />
    </Styled.Container>
  );
};
