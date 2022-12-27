import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";

export const Logs = styled(List)`
  border: 1px solid ${(p) => p.theme.palette.text.secondary};
  border-radius: ${(p) => p.theme.shape.borderRadius}px;
  overflow-x: scroll;
`;

export const LogRecord = styled(ListItemText)`
  font-size: 0.6rem;
  white-space: nowrap;
`;
