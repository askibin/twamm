import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export const Header = styled(Box)`
  align-items: baseline;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled(Typography)`
  padding: ${(p) => p.theme.spacing(2)};
  text-align: left;
`;

export const DetailsControl = styled(Typography)`
  cursor: pointer;
  padding: ${(p) => p.theme.spacing(2)};
`;

export const Amount = styled(Typography)`
  font-size: 40px;
  padding-left: ${(p) => p.theme.spacing(2)};
  padding-right: ${(p) => p.theme.spacing(2)};
`;

export const Values = styled(Stack)`
  justify-content: space-between;
  padding-left: ${(p) => p.theme.spacing(2)};
  padding-right: ${(p) => p.theme.spacing(2)};
  & .MuiChip-label {
    text-transform: uppercase;
  }
`;
