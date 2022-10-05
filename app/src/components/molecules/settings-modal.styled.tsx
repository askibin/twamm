import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";

export const Modal = styled(Box)`
  left: 50%;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing(3)};
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(41, 42, 51);
  border-radius: 16px;
  color: #fff;
`;

export const Line = styled(Divider)`
  border-color: ${({ theme }) => theme.palette.text.secondary};
`;
