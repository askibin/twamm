import type { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

import Table from "../atoms/table";
import { useAccountOrders } from "../../hooks/use-account-orders";

export default () => {
  const { data, error, isValidating } = useAccountOrders();

  const isLoading = !data && !error && isValidating;

  const rows = useMemo(() => {
    if (!data) return [];

    return data.map((_, i) => ({
      id: i,
    }));
  }, [data]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        headerName: "Name",
        field: "id",
        flex: 2,
      },
    ],
    []
  );

  return (
    <Box>
      <Typography pb={2} color="white" variant="h4">
        My Orders
      </Typography>
      <Box>
        <Table
          gridProps={{
            autoHeight: true,
            columns,
            error,
            loading: isLoading,
            rows,
          }}
          filterColumnField="id"
          isUpdating={!isLoading && isValidating}
          searchBoxPlaceholderText="Search orders"
          title="Orders"
        />
      </Box>
    </Box>
  );
};
