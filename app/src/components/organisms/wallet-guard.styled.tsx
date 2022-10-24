import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { styled } from "@mui/material/styles";

export const Container = styled(Card)`
  background: transparent;
  border: 0;
  margin: 0 auto;
`;

export const Inner = styled(CardContent)`
  max-width: var(--min-width);
`;

export const ConnectBox = styled(Box)`
  & .wallet-adapter-dropdown {
    width: 100%;
  }
`;

export const ConnectButton = styled(WalletMultiButton)`
  background: #4bbeff;
  border-radius: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  color: #000;
  &.wallet-adapter-button {
    background-color: #4bbeff;
    border-radius: 40px;
  }
  &:hover,
  &:focus,
  &:active {
    color: #fff;
    background-color: ${({ theme }) => theme.palette.primary.main};
  }
`;
