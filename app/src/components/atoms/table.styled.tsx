import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";

const styledGrid = styled(DataGrid);

export const Container = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)};
  color: #fff;
  background-color: #1b202e;
`;

export const Grid = styledGrid`

  & .MuiDataGrid-row {
    cursor: pointer;
  }
  & [role="cell"] {
    outline: none !important;
    # temporary disable outline. may rework it later
  }
`;
