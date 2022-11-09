import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

const data = {
  solscan: { uri: "https://solscan.io?tx=" },
};

export default () => {
  const [explorer, setExplorer] = useState<string>(data.solscan.uri);

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
        <MenuItem value={data.solscan.uri}>Solscan</MenuItem>
      </Select>
    </FormControl>
  );
};
