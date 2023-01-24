import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import type { ReactNode } from "react";
import useTxRunner from "../contexts/transaction-runner-context";

export default ({ onClose }: { onClose?: () => void }) => {
  const { performanceFee, performanceFees, setPerformanceFee } = useTxRunner();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (event: SelectChangeEvent<unknown>, _: ReactNode) => {
    setPerformanceFee(event.target.value as number);

    if (onClose) onClose();
  };

  const label = "Fee";

  return (
    <FormControl size="small">
      <InputLabel id="select-performanceFee">{label}</InputLabel>
      <Select
        sx={{ width: 110 }}
        labelId="select-performanceFee"
        id="select-performanceFee"
        value={performanceFee}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value={performanceFees[0]}>None</MenuItem>
        <MenuItem value={performanceFees[1]}>High</MenuItem>
        <MenuItem value={performanceFees[2]}>Turbo</MenuItem>
      </Select>
    </FormControl>
  );
};
