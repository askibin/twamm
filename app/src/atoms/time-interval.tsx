import type { MouseEvent, ChangeEvent, SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import { useCallback, useMemo, useState } from "react";

import * as Styled from "./time-interval.styled";
import i18n from "../i18n";
import Intervals from "../molecules/interval-button-group";
import type { IndexedTIF } from "../domain/interval.d";

export default ({
  disabled,
  info,
  label,
  onSelect,
  value,
  valueIndex,
  values,
}: {
  disabled: boolean;
  info?: string;
  label: string;
  onSelect: (arg0: number) => void;
  value?: number | IndexedTIF;
  valueIndex?: number;
  values?: number[];
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (anchorEl) {
        setAnchorEl(null);
      } else {
        setAnchorEl(event.currentTarget);
      }
    },
    [anchorEl, setAnchorEl]
  );

  const intervalValues = useMemo(() => values, [values]);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const onIntervalSelect = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      const event: unknown = e;
      const { target } = event as ChangeEvent<HTMLElement>;

      onSelect(Number(target.getAttribute("data-interval")));
    },
    [onSelect]
  );

  const open = Boolean(anchorEl);

  return (
    <Styled.Interval>
      <Box pb={1}>
        <Styled.Label>
          {label}
          <Styled.InfoControl onClick={handlePopoverOpen}>
            <InfoIcon />
          </Styled.InfoControl>
        </Styled.Label>
        {!info?.length ? null : (
          <Popover
            anchorEl={anchorEl}
            open={open}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            sx={{
              pointerEvents: "none",
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Box p={1}>{info}</Box>
          </Popover>
        )}
      </Box>
      <ButtonGroup variant="outlined" aria-label={i18n.AriaLabelIntervals}>
        <Intervals
          disabled={disabled}
          onClick={onIntervalSelect}
          value={value}
          valueIndex={valueIndex}
          valuesOpt={1} // add the number of optional values to adjust the interval to select
          values={intervalValues}
        />
      </ButtonGroup>
    </Styled.Interval>
  );
};
