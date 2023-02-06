import type { MouseEvent } from "react";
import Box from "@mui/material/Box";
import InfoIcon from "@mui/icons-material/Info";
import M from "easy-maybe/lib";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { useCallback, useMemo, useState } from "react";

import * as Styled from "./trade-intervals.styled";
import TimeInterval from "../atoms/time-interval";
import type { IntervalVariant, PoolTIF } from "../domain/interval.d";
import useIndexedTIFs from "../contexts/tif-context";
import { SpecialIntervals } from "../domain/interval.d";

export default ({
  disabled,
  indexedTifs,
  onSelect,
  selected,
}: {
  disabled: boolean;
  indexedTifs: Voidable<PoolTIF[]>;
  onSelect: (arg0: IntervalVariant, arg1: boolean) => void;
  selected?: IntervalVariant;
}) => {
  const { periodTifs, scheduleTifs, scheduleSelected, periodSelected } =
    useIndexedTIFs();

  const [scheduled, setScheduled] = useState(true);
  const [instant, setInstant] = useState<number>();

  // FEAT: Consider moving popover to the separate component
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

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const onScheduleSelect = useCallback(
    (value: number) => {
      if (value === SpecialIntervals.NO_DELAY) setScheduled(false);
      // hide the schedule buttons when `NO_DELAY` is selected

      if (instant) setInstant(undefined);

      M.tap((itifs) => {
        const indexedTIF = itifs.find((itif) => itif.left === value);

        if (value === SpecialIntervals.NO_DELAY) {
          onSelect(value, false);
        } else if (indexedTIF) {
          onSelect(indexedTIF, true);
        }
      }, M.of(indexedTifs));
    },
    [indexedTifs, instant, onSelect]
  );

  const onPeriodSelect = useCallback(
    (value: number) => {
      M.tap((itifs) => {
        const indexedTIF = itifs.find((itif) => itif.left === value);

        if (value === SpecialIntervals.INSTANT) {
          onSelect(value, false);
        } else if (indexedTIF) {
          onSelect(indexedTIF, false);
        }
      }, M.of(indexedTifs));
    },
    [indexedTifs, onSelect]
  );

  const onToggleSchedule = useCallback(() => {
    if (scheduled) setScheduled(false);
    else setScheduled(true);
  }, [scheduled, setScheduled]);

  const values = useMemo(() => {
    let period;
    let periodIndex;
    let schedule;
    let scheduleIndex;

    if (selected === SpecialIntervals.NO_DELAY) {
      schedule = -1;
      scheduleIndex = -1;
    } else if (selected === SpecialIntervals.INSTANT) {
      schedule = -1;
      period = -2;
      scheduleIndex = -1;
      periodIndex = -2;
    } else if (selected?.tif) {
      schedule = scheduleSelected;
      period = periodSelected;
      if (scheduleSelected && typeof scheduleSelected !== "number") {
        scheduleIndex = indexedTifs?.findIndex(
          (t) => t.tif === scheduleSelected.tif
        );
      }
      if (periodSelected && typeof periodSelected !== "number") {
        periodIndex = indexedTifs?.findIndex(
          (t) => t.tif === periodSelected.tif
        );
      }
    }

    return { schedule, period, periodIndex, scheduleIndex };
  }, [indexedTifs, periodSelected, selected, scheduleSelected]);

  return (
    <>
      <Box pb={2}>
        {scheduled ? (
          <TimeInterval
            disabled={disabled}
            info="Chose the interval to schedule the order for"
            label="Schedule Order"
            onSelect={onScheduleSelect}
            value={values.schedule}
            valueIndex={values.scheduleIndex}
            values={scheduleTifs}
          />
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Switch
              checked={scheduled}
              onClick={onToggleSchedule}
              inputProps={{ "aria-label": "schedule order" }}
              size="small"
            />
            <Styled.ScheduleToggleLabel>
              Schedule Order
              <Styled.InfoControl onClick={handlePopoverOpen}>
                <InfoIcon />
              </Styled.InfoControl>
            </Styled.ScheduleToggleLabel>
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
              <Box p={1}>Chose the interval to schedule the order for</Box>
            </Popover>
          </Stack>
        )}
      </Box>
      <Box pb={2}>
        <TimeInterval
          disabled={disabled}
          info="Execute the order during specified interval"
          label="Execution Period"
          onSelect={onPeriodSelect}
          value={values.period}
          valueIndex={values.periodIndex}
          values={periodTifs}
        />
      </Box>
    </>
  );
};
