import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import type { ReactNode } from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import { useCallback, useMemo, useState } from "react";
import * as Styled from "./slippage-selector.styled";
import useTxRunner from "../contexts/transaction-runner-context";
import storage, { sanidateString } from "../utils/config-storage";

export default ({
  defaultValue = "1",
  onClose,
  name,
}: {
  defaultValue?: string;
  onClose?: () => void;
  name: string;
}) => {
  const { setSlippage, slippage, slippages } = useTxRunner();
  const [enabled, setEnabled] = useState<string>(defaultValue);

  const optionStorage = useMemo(
    () =>
      storage({
        key: `twammOption${name}`,
        enabled: `twammEnableOption${name}`,
        sanidate: sanidateString,
      }),
    [name]
  );

  const optionValue = useMemo(
    () => (optionStorage.get() ?? defaultValue) === "1",
    [defaultValue, optionStorage]
  );

  console.log({ optionValue });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      console.log("option", event.target);
      //setSlippage(event.target.value as number);
      //if (onClose) onClose();
      //
      //
      console.log(enabled)
      if (enabled === "1") {
        setEnabled("0");
        optionStorage.set("0");
      } else {
        setEnabled("1");
        optionStorage.set("1");
      }
    },
    [enabled, optionValue, optionStorage]
  );

  return (
    <FormControlLabel
      control={<Switch checked={enabled === "1"} onChange={handleChange} />}
    />
  );
};
