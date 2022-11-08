import OrderTypeCell from "../atoms/account-order-type-cell";
import PoolFilledQuantityCell from "../atoms/account-order-pool-filled-quantity-cell";
import PoolOrderTimeCell from "../atoms/account-order-pool-order-time-cell";
import PoolQuantityCell from "../atoms/account-order-pool-quantity-cell";
import PoolTIFCell from "../atoms/account-order-pool-tif-cell";
import PoolTIFLeftCell from "../atoms/account-order-pool-tif-left-cell";
import TokenPairCell from "../atoms/account-order-token-pair-cell";

export const columns = () => {
  const cols = [
    {
      headerName: "Token Pair",
      field: "pool",
      width: 200,
      renderCell: TokenPairCell,
      // replace type with arrow & direction
    },
    {
      headerName: "Type",
      field: "orderType",
      renderCell: OrderTypeCell,
      width: 50,
    },
    {
      headerName: "Pool Time Frame",
      field: "ptif",
      renderCell: PoolTIFCell,
      width: 50,
    },
    {
      headerName: "Quantity",
      field: "quantity",
      resizable: false,
      renderCell: PoolQuantityCell,
      flex: 120,
    },
    {
      headerName: "Filled Quantity",
      field: "filledQuantity",
      resizable: false,
      renderCell: PoolFilledQuantityCell,
      flex: 120,
    },
    {
      headerName: "Order Time",
      field: "orderTime",
      renderCell: PoolOrderTimeCell,
      width: 200,
    },
    {
      headerName: "Time Left",
      field: "timeLeft",
      renderCell: PoolTIFLeftCell,
      width: 200,
    },
  ];

  return cols;
};
