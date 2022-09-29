import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

const styledGrid = styled(DataGrid);

export const Grid = styledGrid`
  & .MuiDataGrid-row {
    cursor: pointer;
  }
  & [role="cell"] {
    outline: none !important;
    # temporary disable outline. may rework it later
  }
`;
