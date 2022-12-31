import type { ReactNode } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import * as Styled from "./slippage-selector.styled";
import useTxRunner from "../contexts/transaction-runner-context";

export default ({ onClose }: { onClose?: () => void }) => {
  const { setSlippage, slippage, slippages } = useTxRunner();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (event: SelectChangeEvent<unknown>, _: ReactNode) => {
    setSlippage(event.target.value as number);
    if (onClose) onClose();
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
