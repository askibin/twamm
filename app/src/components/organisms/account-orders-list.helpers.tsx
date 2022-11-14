import type { GridComparatorFn } from "@mui/x-data-grid-pro";
import PoolFilledQuantityCell from "../atoms/account-order-pool-filled-quantity-cell";
import PoolOrderTimeCell from "../atoms/account-order-pool-order-time-cell";
import PoolQuantityCell from "../atoms/account-order-pool-quantity-cell";
import PoolTIFCell from "../atoms/account-order-pool-tif-cell";
import PoolTIFLeftCell from "../atoms/account-order-pool-tif-left-cell";
import TokenPairCell from "../atoms/account-order-token-pair-cell";

const sortByTokenPair: GridComparatorFn<any> = (a, b) => 0;

export const columns = () => {
  const cols = [
    {
      headerName: "Token Pair",
      field: "pool",
      width: 200,
      renderCell: TokenPairCell,
      sortComparator: sortByTokenPair,
    },
    {
      headerName: "Pool Time Frame",
      field: "ptif",
      renderCell: PoolTIFCell,
      resizable: false,
      width: 80,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      renderCell: PoolQuantityCell,
      flex: 200,
    },
    {
      headerName: "Filled Quantity",
      field: "filledQuantity",
      renderCell: PoolFilledQuantityCell,
      flex: 200,
    },
    {
      headerName: "Order Time",
      field: "orderTime",
      renderCell: PoolOrderTimeCell,
      resizable: false,
      width: 180,
    },
    {
      headerName: "Time Left",
      field: "timeLeft",
      renderCell: PoolTIFLeftCell,
      resizable: false,
      width: 100,
    },
  ];

  return cols;
};
