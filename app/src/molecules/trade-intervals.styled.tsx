import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export const ScheduleToggleLabel = styled(Typography)`
  ${(p) => `
    font-size: ${p.theme.typography.overline.fontSize};
    font-weight: ${p.theme.typography.overline.fontWeight};
  `}
  display:flex;
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
