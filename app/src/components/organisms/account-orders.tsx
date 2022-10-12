import type { GridColDef } from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

import Table from "../atoms/table";
import { useAccountOrders } from "../../hooks/use-account-orders";

export default () => {
  const { data, error, isValidating } = useAccountOrders();

  const isLoading = !data && !error;

  const rows = useMemo(() => {
    if (!data) return [];

    return data.map(({ aName, bName }, i) => ({
      id: i,
      name: `${aName}-${bName}`,
    }));
  }, [data]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        headerName: "Name",
        field: "name",
        flex: 2,
      },
    ],
    []
  );

  return (
    <Box>
      <Typography pb={2} variant="h4">
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
          filterColumnField="name"
          isUpdating={!isLoading && isValidating}
          searchBoxPlaceholderText="Search orders"
        />
      </Box>
    </Box>
  );
};
