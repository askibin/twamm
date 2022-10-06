import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { styled } from "@mui/material/styles";

export const Container = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)};
  color: #fff;
  background-color: #1b202e;
`;

export const Grid = styled(DataGridPro)`
  & .MuiDataGrid-row {
    cursor: pointer;
  }
  & [role="cell"] {
    outline: none !important;
    # temporary disable outline. may rework it later
  }
`;
