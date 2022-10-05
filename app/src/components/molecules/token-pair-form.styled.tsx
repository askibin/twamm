import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const TokenLabelBox = styled(Box)`
  color: ${({ theme }) => theme.palette.text.secondary};
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  font-size: 14px;
  font-weight: 600;
`;

export const OperationImage = styled(Box)`
  color: ${({ theme }) => theme.palette.text.secondary};
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(2)};

  & > * {
    border: 1px solid ${({ theme }) => theme.palette.text.secondary};
    border-radius: 100%;
    padding: 3px;
    transform: rotate(90deg);
  }
`;
