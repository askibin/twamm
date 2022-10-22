import type { PublicKey } from "@solana/web3.js";
import type {
  GridColDef,
  GridRowParams,
  GridSelectionModel,
} from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid-pro";
import { useCallback, useMemo, useRef, useState } from "react";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import CancelOrder from "../molecules/cancel-order-modal";
import Maybe from "../../types/maybe";
import OrderDetails from "./account-order-details";
import OrderTypeCell from "../atoms/account-order-type-cell";
import PoolFilledQuantityCell from "../atoms/account-order-pool-filled-quantity-cell";
import PoolOrderTimeCell from "../atoms/account-order-pool-order-time-cell";
import PoolQuantityCell from "../atoms/account-order-pool-quantity-cell";
import PoolTIFCell from "../atoms/account-order-pool-tif-cell";
import PoolTIFLeftCell from "../atoms/account-order-pool-tif-left-cell";
import Table from "../atoms/table";
import TokenPairCell from "../atoms/account-order-token-pair-cell";
import UniversalPopover from "../molecules/universal-popover";
import { address } from "../../utils/twamm-client";
import { useCancelOrder } from "../../hooks/use-cancel-order";

export interface Props {
  data: TMaybe<OrderData[]>;
  error: TMaybe<Error>;
  loading: boolean;
  updating: boolean;
}

type CancelData = {
  aMint: PublicKey;
  bMint: PublicKey;
  lpSupply: number[];
  poolAddress: PublicKey;
};

export default (props: Props) => {
  const data = Maybe.withDefault([], props.data);
  const error = Maybe.withDefault(undefined, props.error);

  const popoverRef = useRef<{ close: () => void; open: () => void }>();
  const [, setAmount] = useState<number>();
  const [accounts, setAccounts] = useState<Partial<CancelData>>({});
  const [checkboxSelection, setCheckboxSelection] = useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  const { execute } = useCancelOrder();

  const rows = useMemo(
    () =>
      data.map(({ pool, side, time }) => ({
        id: address(pool).toString(),
        orderTime: time,
        pool,
        side,
      })),
    [data]
  );

  const columns = useMemo<GridColDef[]>(() => {
    const cols = [
      {
        headerName: "Token Pair",
        field: "pool",
        width: 200,
        renderCell: TokenPairCell,
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

    if (checkboxSelection) {
      return [...cols, { ...GRID_CHECKBOX_SELECTION_COL_DEF, width: 80 }];
    }

    return cols;
  }, [checkboxSelection]);

  const onCancelOrder = useCallback(
    ({
      aAddress,
      bAddress,
      lpAmount,
      lpSupply,
      poolAddress,
    }: {
      aAddress: PublicKey;
      bAddress: PublicKey;
      lpAmount: number;
      lpSupply: number[];
      poolAddress: PublicKey;
    }) => {
      setAmount(lpAmount);
      setAccounts({
        aMint: aAddress,
        bMint: bAddress,
        lpSupply,
        poolAddress,
      });

      popoverRef.current?.open();
    },
    [setAmount, setAccounts]
  );

  const onApproveCancel = useCallback(
    async (lpAmount: number) => {
      const { aMint, bMint, lpSupply, poolAddress } = accounts as CancelData;

      setAmount(lpAmount);

      await execute({
        aMint,
        bMint,
        poolAddress,
        lpAmount: lpSupply[0] + lpSupply[1],
      });

      popoverRef.current?.close();
    },
    [accounts, execute, setAmount]
  );

  const onSelectionModelChange = useCallback(
    (nextSelectionModel: GridSelectionModel) => {
      setSelectionModel(nextSelectionModel);
    },
    [setSelectionModel]
  );

  const onCancelSelectedOrders = useCallback(async () => {
    // const selectedRows = rows.filter((row) => selectionModel.includes(row.id));
  }, [rows, selectionModel]); // eslint-disable-line

  const getDetailPanelContent = useCallback(
    (rowProps: GridRowParams) => (
      <OrderDetails address={rowProps.row.pool} onCancel={onCancelOrder} />
    ),
    [onCancelOrder]
  );

  const [detailsHeight] = useState(310);
  const getDetailPanelHeight = useRef(() => detailsHeight);

  return (
    <>
      <UniversalPopover ref={popoverRef}>
        <CancelOrder onApprove={onApproveCancel} />
      </UniversalPopover>
      <Box>
        <Typography pb={2} variant="h4">
          My Orders
        </Typography>
        <Box py={2}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => setCheckboxSelection(!checkboxSelection)}
            >
              Bulk Action
            </Button>
            <Button
              variant="outlined"
              onClick={onCancelSelectedOrders}
              disabled={!(checkboxSelection && selectionModel?.length)}
            >
              Cancel/Withdraw Selected
            </Button>
          </Stack>
        </Box>
        <Box minWidth="680px">
          <Table
            gridProps={{
              autoHeight: true,
              checkboxSelection,
              columns,
              error,
              getDetailPanelContent,
              getDetailPanelHeight: getDetailPanelHeight.current,
              loading: props.loading,
              onSelectionModelChange,
              rows,
              selectionModel,
            }}
            filterColumnField="pool"
            isUpdating={props.updating}
            searchBoxPlaceholderText="Search orders"
          />
        </Box>
      </Box>
    </>
  );
};
