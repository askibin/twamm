import type { ReactNode } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { SelectChangeEvent } from "@mui/material/Select";
import * as Styled from "./explorer-selector.styled";
import useTxRunner from "../contexts/transaction-runner-context";

export default () => {
  const { explorer, explorers, setExplorer } = useTxRunner();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (event: SelectChangeEvent<unknown>, _: ReactNode) => {
    setExplorer(event.target.value as string);
  };

  return (
    <FormControl size="small">
      <InputLabel id="select-explorer">Explorer</InputLabel>
      <Styled.ExplorerSelect
        labelId="select-explorer"
        id="select-explorer"
        value={explorer}
        label="Explorer"
        onChange={handleChange}
      >
        <MenuItem value={explorers.explorer.uri}>Explorer</MenuItem>
        <MenuItem value={explorers.solscan.uri}>Solscan</MenuItem>
        <MenuItem value={explorers.solanafm.uri}>SolanaFM</MenuItem>
      </Styled.ExplorerSelect>
    </FormControl>
  );
};
