import Box from "@mui/material/Box";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { styled } from "@mui/material/styles";

export const Search = styled(Box)`
  align-items: center;
  dispaly: flex;
  justify-content: space-between;
  margin-bottom: 24px;
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
