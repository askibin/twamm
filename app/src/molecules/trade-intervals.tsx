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
import type { PoolTIF, SelectedTIF } from "../domain/interval.d";
import useIndexedTifs from "../contexts/tif-context";
import { SpecialIntervals } from "../domain/interval.d";

export default ({
  disabled,
  indexedTifs: tifs,
  onSelect,
}: {
  disabled: boolean;
  indexedTifs: Voidable<PoolTIF[]>;
  onSelect: (arg0: SelectedTIF) => void;
}) => {
  const indexedTifs = useMemo(() => tifs, [tifs]);

  const {
    pairSelected: ps,
    periodTifs: pt,
    scheduleTifs: st,
    selected,
    data,
  } = useIndexedTifs();

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

      // dispatch(A.setSchedule({ tif: value }));

      M.tap((itifs) => {
        const indexedTIF = itifs.find((itif) => itif.left === value);

        const nextValue = [
          value !== -1
            ? itifs.find((itif) => itif.left === value)?.tif
            : undefined,
          value,
        ];

        if (value === SpecialIntervals.NO_DELAY) {
          onSelect(nextValue, value, false);
        } else {
          onSelect(nextValue, indexedTIF, true);
        }
      }, M.of(indexedTifs));
    },
    [indexedTifs, instant, onSelect]
  );

  const onPeriodSelect = useCallback(
    (value: number) => {
      const nextValue = undefined; // [value, state.data.pairSelected[1]];
      M.tap((itifs) => {
        const indexedTIF = itifs.find((itif) => itif.left === value);

        if (value === SpecialIntervals.INSTANT) {
          onSelect(nextValue, value, false);
        } else {
          onSelect(nextValue, indexedTIF, false);
        }
      }, M.of(indexedTifs));

      // onSelect(nextValue);
    },
    [indexedTifs, onSelect]
  );

  const onToggleSchedule = useCallback(() => {
    if (scheduled) setScheduled(false);
    else setScheduled(true);
  }, [scheduled, setScheduled]);

  const values = useMemo(() => {
    let schedule;
    let period;
    if (ps === SpecialIntervals.NO_DELAY) {
      schedule = -1;
    } else if (ps === SpecialIntervals.INSTANT) {
      schedule = -1;
      period = -2;
    } else if (ps?.tif) {
      schedule = data.scheduleSelected;
      period = data.periodSelected;
    }

    return { schedule, period };
  }, [ps, data]);

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
            values={st}
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
          values={pt}
        />
      </Box>
    </>
  );
};
