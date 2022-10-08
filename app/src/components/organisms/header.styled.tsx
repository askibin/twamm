import type { CardProps } from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";

interface ActiveCardProps extends CardProps {
  istxactive?: boolean;
}

export const Header = styled(Toolbar)`
  justify-content: space-between;
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

  ${(params: ActiveCardProps) =>
    params.istxactive &&
    `
    & > svg {
      animation: rotation infinite 2s linear;
    }
  `}
`;
