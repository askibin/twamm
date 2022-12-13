import type { ReactNode } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { SelectChangeEvent } from "@mui/material/Select";
import * as Styled from "./slippage-selector.styled";
import useTxRunnerContext from "../../hooks/use-transaction-runner-context";

export default () => {
  const { setSlippage, slippage, slippages } = useTxRunnerContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (event: SelectChangeEvent<unknown>, _: ReactNode) => {
    setSlippage(event.target.value as number);
  };

  return (
    <FormControl size="small">
      <InputLabel id="select-explorer">Val, %</InputLabel>
      <Styled.SlippageSelect
        labelId="select-explorer"
        id="select-explorer"
        value={slippage}
        label="Slippage"
        onChange={handleChange}
      >
        {slippages.map((s) => (
          <MenuItem value={s} key={s}>
            {s}
          </MenuItem>
        ))}
      </Styled.SlippageSelect>
    </FormControl>
  );
};
