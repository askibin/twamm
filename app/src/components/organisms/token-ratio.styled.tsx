import type { Theme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const styledPaper = styled(Paper);

export const Swap = styledPaper`
  background: linear-gradient(110.5deg, rgba(26, 31, 46, 0.4) 3.75%, rgba(36, 41, 57, 0.4) 117.62%);
  border: 1px solid ${({ theme }: { theme: Theme }) =>
    theme.palette.action.selected};
`;
