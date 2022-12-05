import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import { styled } from "@mui/material/styles";

export const BlankIntervals = styled(Skeleton)`
  border-radius: 8px;
  height: 26.5px;
  width: 50%;
`;

export const Interval = styled(Box)`
  color: ${({ theme }) => theme.palette.text.primary};
`;

export const Label = styled(Box)`
  font-size: 13px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ScheduleButton = styled(Button)`
  padding: 0 4px;
  text-transform: capitalize;

  &.Mui-disabled {
    color: ${({ theme }) => theme.palette.success.dark};
    border-color: ${({ theme }) => theme.palette.success.dark};
  }
  &.Mui-disabled + * {
    border-left-color: ${({ theme }) => theme.palette.success.dark};
  }
`;

export const MobileScheduleButton = styled(ScheduleButton)`
  padding: 0 2px;
  font-size: 12px;
  text-transform: capitalize;
`;

export const InfoControl = styled(IconButton)`
  padding: 0;
`;
