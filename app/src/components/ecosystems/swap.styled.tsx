import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export const Section = styled(Box)`
  position: relative;
`;

export const SettingsControl = styled(Box)`
  position: absolute;
  top: 0;
  right: -50px;
`;

export const Control = styled(Paper)`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.palette.text.secondary};
  display: flex;
  padding: 8px;
  cursor: pointer;
`;

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
