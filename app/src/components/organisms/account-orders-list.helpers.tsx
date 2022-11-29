import type { PublicKey } from "@solana/web3.js";
import type {
  ComparatorFn,
  RowParams,
  ValueGetterParams,
} from "./row-column-list";
import PoolOrderTimeCell from "../atoms/account-order-pool-order-time-cell";
import PoolTIFCell from "../atoms/account-order-pool-tif-cell";
import PoolTIFLeftCell from "../atoms/account-order-pool-tif-left-cell";
import TokenPairCell from "../atoms/account-order-token-pair-cell";
import { filledQuantity, quantity } from "../../domain/order-details";
import { formatPrice } from "../../domain/index";

const sortByTokenPair: ComparatorFn<PublicKey> = (a, b) => {
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
  data: RowParams<ReturnType<typeof populateRow>>
) => ({
  order: data.row.orderData,
  poolAddress: data.row.pool,
  side: data.row.side,
  supply: data.row.supply,
});

export const columns = ({ isMobile }: { isMobile?: boolean }) => [
  {
    field: "pre",
    hidable: false,
    sortable: false,
    xs: 1,
    md: 2,
  },
  {
    field: "tokenPair",
    headerName: "Token Pair",
    hideable: false,
    renderCell: TokenPairCell,
    sortable: false,
    sortComparator: sortByTokenPair,
    xs: isMobile ? 6 : 3,
    md: isMobile ? 6 : 2,
  },
  {
    field: "tif",
    headerName: "Time Frame",
    hideable: true,
    renderCell: PoolTIFCell,
    resizable: false,
    sortable: true,
    xs: 1,
    md: 1,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    hideable: false,
    sortable: true,
    xs: isMobile ? 3 : 2,
    md: isMobile ? 3 : 1.5,
    valueGetter: ({ row }: ValueGetterParams) => formatPrice(row.quantity),
  },
  {
    field: "filledQuantity",
    headerName: "Filled Quantity",
    hideable: false,
    sortable: true,
    xs: isMobile ? 3 : 2,
    md: isMobile ? 3 : 1.5,
    valueGetter: ({ row }: ValueGetterParams) =>
      formatPrice(row.filledQuantity),
  },
  {
    field: "orderTime",
    headerName: "Order Time",
    hideable: true,
    renderCell: PoolOrderTimeCell,
    resizable: false,
    sortable: true,
    xs: 2,
    md: 3,
  },
  {
    field: "timeLeft",
    headerName: "Liveness",
    hideable: true,
    renderCell: PoolTIFLeftCell,
    resizable: false,
    sortable: false,
    xs: 1,
    md: 1,
  },
];
