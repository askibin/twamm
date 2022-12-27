import type { MouseEvent, ChangeEvent, SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import { useCallback, useState } from "react";

import * as Styled from "./time-interval.styled";
import Intervals, { Instant } from "../molecules/interval-button-group";
import { instantTif } from "../../reducers/trade-intervals.reducer";

export interface Props {
  disabled: boolean;
  info?: string;
  label: string;
  useInstantOption?: boolean;
  value?: number;
  values?: number[];
  onSelect: (arg0: number) => void;
  onSelectInstant?: (arg0: number) => void;
}

export const INSTANT_INTERVAL = instantTif;

export default ({
  disabled,
  info,
  label,
  onSelect,
  onSelectInstant,
  useInstantOption = false,
  value,
  values,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

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

  const onInstantIntervalSelect = useCallback(() => {
    if (onSelectInstant) onSelectInstant(INSTANT_INTERVAL);
  }, [onSelectInstant]);

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
            {info}
          </Popover>
        )}
      </Box>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        {useInstantOption && (
          <Instant
            value={value}
            values={values}
            onSelect={onInstantIntervalSelect}
          />
        )}
        <Intervals
          disabled={disabled}
          onClick={onIntervalSelect}
          value={value}
          values={values}
        />
      </ButtonGroup>
    </Styled.Interval>
  );
};
