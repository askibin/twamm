import type { GridColDef } from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import Maybe from "../../types/maybe";
import Table from "../atoms/table";
import TokensCell from "../atoms/account-orders-tokens-cell";

export interface Props {
  data: TMaybe<OrderData[]>;
  error: TMaybe<Error>;
  loading: boolean;
  updating: boolean;
}

export default (props: Props) => {
  const data = Maybe.withDefault([], props.data);
  const error = Maybe.withDefault(undefined, props.error);

  const rows = useMemo(
    () =>
      data.map(
        (
          {
            pool,
            ptif = 0,
            orderTime = 0,
            timeLeft = 0,
            quantity = 0,
            filledQuantity = 0,
          },
          i
        ) => ({
          id: i,
          ptif,
          pool,
          orderTime,
          timeLeft,
          quantity,
          filledQuantity,
        })
      ),
    [data]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        headerName: "Token Pair",
        field: "pool",
        flex: 5,
        renderCell: TokensCell,
      },
      {
        headerName: "Pool Time Frame",
        field: "ptif",
      },
      {
        headerName: "Order Time",
        field: "orderTime",
      },
      {
        headerName: "Time Left",
        field: "timeLeft",
      },
      {
        headerName: "Quantity",
        field: "quantity",
      },
      {
        headerName: "Filled Quantity",
        field: "filledQuantity",
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
            loading: props.loading,
            rows,
          }}
          filterColumnField="pool"
          isUpdating={props.updating}
          searchBoxPlaceholderText="Search orders"
        />
      </Box>
    </Box>
  );
};
