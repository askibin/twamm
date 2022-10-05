import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import Skeleton from "@mui/material/Skeleton";
import { memo, useState } from "react";

import * as Styled from "./time-interval.styled";

export interface Props {
  info?: string;
  label: string;
  values?: number[];
}

const formatInterval = (value: number) => {
  if (value < 0) return "no delay";

  const h = parseInt(String(value / 3600), 10);
  const leftM = value - h * 3600;
  const m = parseInt(String(leftM / 60), 10);
  const s = value - m * 60;

  if (h) return `${h}h${m ? ` ${m}m` : ""}`;

  return `${m ? `${m}m ` : ""}${s ? `${s}s` : ""}`;
};

const Intervals = memo(({ values }: { values?: number[] }) => {
  if (!values) return <Skeleton variant="rectangular" />;

  return (
    <ButtonGroup variant="outlined" aria-label="outlined button group">
      {values.map((value: number) => (
        <Styled.ScheduleButton key={value}>
          {formatInterval(value)}
        </Styled.ScheduleButton>
      ))}
    </ButtonGroup>
  );
});

export default ({ info, label, values }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Styled.Interval>
      <Box pb={1}>
        <Styled.Label>
          {label}
          <Box onClick={handlePopoverOpen}>
            <InfoIcon />
          </Box>
        </Styled.Label>
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
      </Box>
      <Intervals values={values} />
    </Styled.Interval>
  );
};
