import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

const data = new Map([["solscan", "https://solscan.io?tx="]]);

export default () => {
  const [explorer, setExplorer] = useState<string>(data.get("solscan"));

  const handleChange = (event: SelectChangeEvent) => {
    setExplorer(event.target.value);
  };

  return (
    <FormControl size="small">
      <InputLabel id="select-explorer">Explorer</InputLabel>
      <Select
        labelId="select-explorer"
        id="select-explorer"
        value={explorer}
        label="Explorer"
        onChange={handleChange}
      >
        <MenuItem value={data.get("solscan")}>Solscan</MenuItem>
      </Select>
    </FormControl>
  );
};
