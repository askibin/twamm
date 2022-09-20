import { TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useCallback, useMemo, useState } from "react";
import type {
  DataGridProps,
  GridRowIdGetter,
  GridRowParams,
} from "@mui/x-data-grid";
import type { ChangeEvent, MouseEvent } from "react";

import * as Styled from "./table.styled";

interface Props {
  description?: string;
  filterColumnField: string;
  getRowId?: GridRowIdGetter;
  gridProps: DataGridProps;
  isUpdating?: boolean;
  onRowClick?: (arg0: GridRowParams, arg1: MouseEvent<HTMLElement>) => void;
  searchBoxPlaceholderText?: string;
  title?: string;
}

export default ({
  description,
  filterColumnField,
  getRowId,
  gridProps,
  isUpdating = false,
  onRowClick = () => {},
  searchBoxPlaceholderText,
  title,
}: Props) => {
  const [filterText, setFilterText] = useState("");

  const options = useMemo(() => ({ pagination: { pageSize: 10 } }), []);
  const pages = useMemo(() => [10, 25, 50, 100], []);

  const onFilterChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFilterText(event.target.value);
    },
    [setFilterText]
  );

  const filterModel = useMemo(
    () => ({
      items: [
        {
          columnField: filterColumnField,
          operatorValue: "contains",
          value: filterText,
        },
      ],
    }),
    [filterColumnField, filterText]
  );

  return (
    <Paper sx={{ padding: "24px" }}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <Box>
          {title && <Typography variant="h6">{title}</Typography>}
          {description && <Typography color="gray">{description}</Typography>}
        </Box>

        <TextField
          size="small"
          placeholder={searchBoxPlaceholderText ?? "Search"}
          onChange={onFilterChange}
        />
      </Box>

      <Styled.Grid
        density="compact"
        getRowId={getRowId}
        initialState={options}
        rowsPerPageOptions={pages}
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableSelectionOnClick
        filterModel={filterModel}
        onRowClick={onRowClick}
        pagination
        {...gridProps} /* eslint-disable-line react/jsx-props-no-spreading */
      />
      {isUpdating && <Typography variant="body1">Updating...</Typography>}
    </Paper>
  );
};
