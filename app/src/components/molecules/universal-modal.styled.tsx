import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export const Inner = styled(Paper)`
  left: 50%;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing(2)};
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 640px;
`;

export const Close = styled(IconButton)`
  position: absolute;
  right: 0;
  top: 0;
`;
