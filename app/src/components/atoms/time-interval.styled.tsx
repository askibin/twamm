import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

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
`;

export const InfoControl = styled(IconButton)`
  padding: 0;
`;
