import type { MouseEvent } from "react";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import { memo, useCallback, useState } from "react";

import * as Styled from "./time-interval.styled";
import useBreakpoints from "../../hooks/use-breakpoints";
import { formatInterval } from "../../utils/index";

export interface Props {
  info?: string;
  label: string;
  value?: number;
  values?: number[];
  onSelect: (arg0: number) => void;
}

const Intervals = memo(
  ({
    value: selectedValue,
    values,
    onSelect,
  }: {
    value?: number;
    values?: number[];
    onSelect: (e: MouseEvent<HTMLElement>) => void;
  }) => {
    const { isMobile } = useBreakpoints();

    if (!values) return <Styled.BlankIntervals variant="rectangular" />;

    return (
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        {values
          .filter((value: number) => value !== 0)
          .map((value: number) => {
            const disabled = value === selectedValue;

            return isMobile ? (
              <Styled.MobileScheduleButton
                data-interval={value}
                key={value}
                onClick={onSelect}
                disabled={disabled}
              >
                {formatInterval(value)}
              </Styled.MobileScheduleButton>
            ) : (
              <Styled.ScheduleButton
                data-interval={value}
                key={value}
                onClick={onSelect}
                disabled={disabled}
              >
                {formatInterval(value)}
              </Styled.ScheduleButton>
            );
          })}
      </ButtonGroup>
    );
  }
);

export default ({ info, label, value, values, onSelect }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const onIntervalSelect = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      // @ts-ignore
      onSelect(Number(e.target.getAttribute("data-interval")));
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
            {info}
          </Popover>
        )}
      </Box>
      <Intervals value={value} values={values} onSelect={onIntervalSelect} />
    </Styled.Interval>
  );
};
