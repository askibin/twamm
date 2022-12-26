import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
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

export const InfoControl = styled(IconButton)`
  padding: 0;
`;
