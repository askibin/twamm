import type { GridColDef, GridRowParams } from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCallback, useMemo, useRef } from "react";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import Maybe from "../../types/maybe";
import PoolFilledQuantityCell from "../atoms/account-order-pool-filled-quantity-cell";
import PoolOrderTimeCell from "../atoms/account-order-pool-order-time-cell";
import PoolQuantityCell from "../atoms/account-order-pool-quantity-cell";
import PoolTIFCell from "../atoms/account-order-pool-tif-cell";
import PoolTIFLeftCell from "../atoms/account-order-pool-tif-left-cell";
import Table from "../atoms/table";
import TokenPairCell from "../atoms/account-order-token-pair-cell";
import OrderDetails from "./account-order-details";

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
      data.map(({ pool, side, time }) => ({
        id: pool.toBase58(),
        pool,
        orderTime: time.toNumber(),
        quantity: side,
        filledQuantity: side,
      })),
    [data]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        headerName: "Token Pair",
        field: "pool",
        flex: 5,
        renderCell: TokenPairCell,
      },
      {
        headerName: "Pool Time Frame",
        field: "ptif",
        renderCell: PoolTIFCell,
        width: 80,
      },
      {
        headerName: "Order Time",
        field: "orderTime",
        renderCell: PoolOrderTimeCell,
        flex: 4,
      },
      {
        headerName: "Time Left",
        field: "timeLeft",
        renderCell: PoolTIFLeftCell,
      },
      {
        headerName: "Quantity",
        field: "quantity",
        width: 80,
        resizable: false,
        renderCell: PoolQuantityCell,
      },
      {
        headerName: "Filled Quantity",
        field: "filledQuantity",
        width: 80,
        resizable: false,
        renderCell: PoolFilledQuantityCell,
      },
    ],
    []
  );

  const getDetailPanelContent = useCallback(
    (props: GridRowParams) => console.log(props) || <OrderDetails />,
    []
  );

  const getDetailPanelHeight = useRef(() => 56);

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
            getDetailPanelContent,
            // getDetailPanelHeight: getDetailPanelHeight.current,
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
