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
  useInstantOption?: boolean;
  value?: number;
  values?: number[];
  onSelect: (arg0: number) => void;
  onSelectInstant?: (arg0: number) => void;
}

export const INSTANT_INTERVAL = -2;

const Instant = (props: {
  onSelect: () => void;
  value: Voidable<number>;
  values: Voidable<any>;
}) => {
  const { isMobile } = useBreakpoints();

  const disabled = props.value === INSTANT_INTERVAL;

  if (!props.values) return <Styled.BlankIntervals variant="rectangular" />;
  return isMobile ? (
    <Styled.MobileScheduleButton
      data-interval={props.value}
      key={props.value}
      onClick={props.onSelect}
      disabled={disabled}
    >
      Instant
    </Styled.MobileScheduleButton>
  ) : (
    <Styled.ScheduleButton
      data-interval={props.value}
      key={props.value}
      onClick={props.onSelect}
      disabled={disabled}
    >
      Instant
    </Styled.ScheduleButton>
  );
};

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
      <>
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
      </>
    );
  }
);

export default ({
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
    (e: MouseEvent<HTMLElement>) => {
      // @ts-ignore
      onSelect(Number(e.target.getAttribute("data-interval")));
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
        <Intervals value={value} values={values} onSelect={onIntervalSelect} />
      </ButtonGroup>
    </Styled.Interval>
  );
};
