import type { CardProps } from "@mui/material/Card";
import type { Theme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";

interface ActiveCardProps extends CardProps {
  istxactive?: boolean;
  istxerror?: boolean;
  istxsuccess?: boolean;
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
  display: flex;
  padding: 4px;

  ${(params: ActiveCardProps) =>
    params.istxactive &&
    !params.istxerror &&
    !params.istxsuccess &&
    `
    & > svg {
      animation: rotation infinite 2s linear;
    }
  `}

  ${(params: ActiveCardProps & { theme: Theme }) =>
    params.istxerror &&
    `
    & > svg {
      color: ${params.theme.palette.error.main};
    }
  `}

  ${(params: ActiveCardProps & { theme: Theme }) =>
    params.istxsuccess &&
    `
    & > svg {
      color: ${params.theme.palette.success.main};
    }
  `};
`;
