import type { PublicKey } from "@solana/web3.js";
import type {
  GridColDef,
  GridRowParams,
  GridComparatorFn,
} from "@mui/x-data-grid-pro";
import PoolOrderTimeCell from "../atoms/account-order-pool-order-time-cell";
import PoolTIFCell from "../atoms/account-order-pool-tif-cell";
import PoolTIFLeftCell from "../atoms/account-order-pool-tif-left-cell";
import TokenPairCell from "../atoms/account-order-token-pair-cell";
import { filledQuantity, quantity } from "../../domain/order-details";

const sortByTokenPair: GridComparatorFn<PublicKey> = (a, b) => {
  const aKey = String(a);
  const bKey = String(b);

  if (aKey === bKey) return 0;
  return aKey < bKey ? -1 : 1;
};

export const populateRow = (data: OrderPoolRecord) => {
  const order = {
    address: data.order,
    lpBalance: data.lpBalance,
    side: data.side,
    tokenDebt: data.tokenDebt,
  };

  const amount = quantity(data.tokenPairData, data.poolData, data.side);
  const filledAmount = filledQuantity(
    data.tokenPairData,
    data.poolData,
    data.side
  );

  return {
    id: data.id,
    // FIXME: replace data with address V
    filledQuantity: filledAmount,
    order,
    orderData: order,
    orderTime: data.time,
    pool: data.pool,
    poolData: data.poolData,
    // TODO: check availability to remove the field
    quantity: amount,
    side: data.side,
    supply: data.lpBalance,
    tif: data.poolData.timeInForce,
    tokenPair: data.poolData.tokenPair,
  };
};

export const populateDetails = (
  data: GridRowParams<ReturnType<typeof populateRow>>
) => ({
  order: data.row.orderData,
  poolAddress: data.row.pool,
  side: data.row.side,
  supply: data.row.supply,
});

export const columns = (): GridColDef[] => [
  {
    field: "tokenPair",
    headerName: "Token Pair",
    hideable: false,
    renderCell: TokenPairCell,
    sortable: false,
    sortComparator: sortByTokenPair,
    width: 200,
  },
  {
    field: "tif",
    headerName: "Time Frame",
    hideable: true,
    renderCell: PoolTIFCell,
    resizable: false,
    width: 130,
  },
  {
    field: "quantity",
    flex: 200,
    headerName: "Quantity",
    hideable: false,
  },
  {
    field: "filledQuantity",
    flex: 150,
    headerName: "Filled Quantity",
    hideable: true,
  },
  {
    field: "orderTime",
    headerName: "Order Time",
    hideable: true,
    renderCell: PoolOrderTimeCell,
    resizable: false,
    width: 180,
  },
  {
    field: "timeLeft",
    headerName: "Time Left",
    hideable: true,
    renderCell: PoolTIFLeftCell,
    resizable: false,
    sortable: false,
    width: 90,
  },
];
