import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const TokenField = styled(Box)`
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  flex-grow: 0;
  align-items: center;
  cursor: pointer;
`;

export const TokenIcon = styled(Avatar)`
  width: 60px;
  height: 60px;
  margin-right: 12px;
  & > svg {
    width: 75%;
    height: 75%;
  }
`;

export const TokenName = styled("span")`
  text-transform: uppercase;
  color: #fff;
`;

export const TokenControl = styled("div")`
  color: #fff;
  width: 24px;
  height: 24px;
  margin-left: 4px;
`;
