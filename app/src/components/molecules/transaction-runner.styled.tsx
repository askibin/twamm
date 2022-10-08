import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export const Inner = styled(Paper)`
  left: 50%;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing(4)};
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const Close = styled(IconButton)`
  position: absolute;
  right: 0;
  top: 0;
`;

export const Line = styled(Divider)`
  border-color: ${({ theme }) => theme.palette.text.secondary};
`;
