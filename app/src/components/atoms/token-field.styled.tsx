import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { NumericFormat } from "react-number-format";
import { styled } from "@mui/material/styles";

export const TokenField = styled(Box)`
  background: rgba(0, 0, 0, 0.32);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  height: 79px;
`;

export const TokenIcon = styled(Avatar)`
  width: 60px;
  height: 60px;
`;

export const TokenAmountTextField = styled(NumericFormat)`
  border: none;
  width: 100%;
  outline: transparent;
  background: transparent;
  padding: 5px 12px;
  font-size: 32px;
  font-weight: 600px;
  color: #fff;
`;

export const TokenName = styled("span")``;

export const TokenAmountInUSD = styled(Box)`
  color: ${({ theme }) => theme.palette.text.secondary};
  padding: 0 12px;
  font-size: 16px;
  font-weight: 500;
`;
