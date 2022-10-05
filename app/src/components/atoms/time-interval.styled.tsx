import type { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export const Interval = styled("div")`
  color: #fff;
  padding: ${({ theme }: { theme: Theme }) => theme.spacing(1)};
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
`;
