import type { MouseEvent } from "react";
import Box from "@mui/material/Box";
import InfoIcon from "@mui/icons-material/Info";
import M from "easy-maybe/lib";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { useCallback, useEffect, useMemo, useState } from "react";

import * as Styled from "./trade-intervals.styled";
import TimeInterval from "../atoms/time-interval";
import type { PoolTIF, SelectedTIF } from "../domain/interval.d";
import useTradeIntervals, { action as A } from "../hooks/use-trade-intervals";
import { optionalIntervals } from "../domain/interval";
import { SpecialIntervals } from "../domain/interval.d";

export default ({
  disabled,
  indexedTifs: tifs,
  minTimeTillExpiration,
  onSelect,
  selectedTif,
}: {
  disabled: boolean;
  indexedTifs: Voidable<PoolTIF[]>;
  minTimeTillExpiration: Voidable<number>;
  onSelect: (arg0: SelectedTIF) => void;
  selectedTif?: SelectedTIF;
}) => {
  const indexedTifs = useMemo(() => tifs, [tifs]);

  const [scheduled, setScheduled] = useState(false);
  const [state, dispatch] = useTradeIntervals();
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

  useEffect(() => {
    M.andMap<PoolTIF[], void>((t) => {
      dispatch(
        A.setTifs({
          indexedTifs: t,
          minTimeTillExpiration,
          optionalIntervals,
          selectedTif: selectedTif ?? [undefined, SpecialIntervals.NO_DELAY],
        })
      );
    }, M.of(indexedTifs));

    //M.andMap((t) => {
    //dispatch(A.resetTif({ selectedTif: t }));
    //}, M.of(selectedTif));

    return () => {};
  }, [dispatch, indexedTifs, minTimeTillExpiration, selectedTif]);

  const onScheduleSelect = useCallback(
    (value: number) => {
      console.log("BBBB", value);
      if (value === SpecialIntervals.NO_DELAY) setScheduled(false);
      // hide the schedule buttons when `NO_DELAY` is selected

      if (instant) setInstant(undefined);

      dispatch(A.setSchedule({ tif: value }));

      M.tap((itifs) => {
        console.log("AA", itifs, value);

        const indexedTIF = itifs.find((itif) => itif.left === value);

        const nextValue = [
          value !== -1
            ? itifs.find((itif) => itif.left === value)?.tif
            : undefined,
          value,
        ];

        if (value === SpecialIntervals.NO_DELAY) {
          console.log(nextValue, value);
          onSelect(nextValue, value, false);
        } else {
          console.log(nextValue, indexedTIF);
          onSelect(nextValue, indexedTIF, true);
        }
      }, M.of(indexedTifs));
    },
    [dispatch, indexedTifs, instant, onSelect]
  );

  const onPeriodSelect = useCallback(
    (value: number) => {
      console.log("AAPP", value);

      if (!state.data?.pairSelected) return;
      dispatch(A.setPeriod({ tif: value }));

      const nextValue = [value, state.data.pairSelected[1]];
      M.tap((itifs) => {
        const indexedTIF = itifs.find((itif) => itif.left === value);

        if (value === SpecialIntervals.INSTANT) {
          console.log(nextValue, value);
          onSelect(nextValue, value, false);
        } else {
          console.log(nextValue, indexedTIF);
          console.log("AAperiod", value, indexedTIF);
          onSelect(nextValue, indexedTIF, false);
        }
      }, M.of(indexedTifs));

      // onSelect(nextValue);
    },
    [dispatch, indexedTifs, onSelect, state.data]
  );

  const onToggleSchedule = useCallback(() => {
    if (scheduled) setScheduled(false);
    else setScheduled(true);
  }, [scheduled, setScheduled]);

  const { pairSelected = [] } = state.data ?? {};

  return (
    <>
      <Box pb={2}>
        {scheduled ? (
          <TimeInterval
            disabled={disabled}
            info="Chose the interval to schedule the order for"
            label="Schedule Order"
            onSelect={onScheduleSelect}
            value={instant || pairSelected[1]}
            values={state.data?.scheduleTifs}
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
          value={pairSelected[0]}
          values={state.data?.periodTifs}
        />
      </Box>
    </>
  );
};
