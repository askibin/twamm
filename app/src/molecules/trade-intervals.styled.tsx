import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export const ScheduleToggleLabel = styled(Typography)`
  ${(p) => `
    font-size: ${p.theme.typography.overline.fontSize};
    font-weight: ${p.theme.typography.overline.fontWeight};
  `}
`;
