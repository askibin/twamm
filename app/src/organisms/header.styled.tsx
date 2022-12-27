import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";

export const Header = styled(Toolbar)`
  justify-content: space-between;
  background-color: #121623;
`;

export const Logo = styled(Stack)`
  align-items: center;
`;

export const Image = styled(Avatar)`
  margin-right: 8px;
`;

export const Controls = styled(Stack)`
  flex-grow: 0;
  align-items: center;
`;

export const UtilsControl = styled(Card)`
  cursor: pointer;
  display: flex;
  padding: 4px;
`;
