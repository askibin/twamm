import type { BN } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import type {
  GridColDef,
  GridRowParams,
  GridSelectionModel,
} from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Maybe from "easy-maybe/lib";
import Stack from "@mui/material/Stack";
import { useCallback, useMemo, useRef, useState } from "react";

import CancelOrder from "../molecules/cancel-order-modal";
import OrderDetails from "./account-order-details";
import Table from "../atoms/table";
import UniversalPopover from "../molecules/universal-popover";
import { address } from "../../utils/twamm-client";
import { columns as cols } from "./account-orders-list.helpers";
import { useCancelOrder } from "../../hooks/use-cancel-order";

export interface Props {
  data: Voidable<OrderData[]>;
  error: Voidable<Error>;
  loading: boolean;
  updating: boolean;
}

type RowData = {
  id: string;
  orderTime: BN;
  pool: PublicKey;
  side: OrderTypeStruct;
  supply: BN;
};

export default (props: Props) => {
  const data = Maybe.withDefault([], Maybe.of(props.data));
  const error = Maybe.withDefault(undefined, Maybe.of(props.error));

  const popoverRef = useRef<{ close: () => void; open: () => void }>();
  const [accounts, setAccounts] = useState<CancelOrderData | undefined>();
  const [checkboxSelection, setCheckboxSelection] = useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

  const { execute } = useCancelOrder();

  const columns = useMemo<GridColDef[]>(cols, [checkboxSelection]);

  const rows: RowData[] = useMemo(
    () =>
      data.map((order) => ({
        id: address(order.pool).toString(),
        orderTime: order.time,
        pool: order.pool,
        side: order.side,
        supply: order.lpBalance,
      })),
    [data]
  );

  const onCancelOrder = useCallback(
    async (cd: CancelOrderData) => {
      const { a, b, inactive, expired, poolAddress, supply } = cd;

      if (inactive || expired) {
        const amount = supply.toNumber();

        await execute({ a, b, poolAddress, amount });
      } else {
        setAccounts(cd);
        popoverRef.current?.open();
      }
    },
    [execute, setAccounts]
  );

  const getDetailPanelContent = useCallback(
    (rowProps: GridRowParams<RowData>) => (
      <OrderDetails
        address={rowProps.row.pool}
        onCancel={onCancelOrder}
        side={rowProps.row.side}
        supply={rowProps.row.supply}
      />
    ),
    [onCancelOrder]
  );

  const onApproveCancel = useCallback(
    async (cd: CancelOrderData) => {
      const { a, b, poolAddress, supply } = cd;
      const amount = supply.toNumber();
      await execute({ a, b, poolAddress, amount });

      popoverRef.current?.close();
    },
    [execute]
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

  const [detailsHeight] = useState(310);
  const getDetailPanelHeight = useRef(() => detailsHeight);

  return (
    <>
      <UniversalPopover ref={popoverRef}>
        <CancelOrder onApprove={onApproveCancel} data={accounts} />
      </UniversalPopover>

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
    </>
  );
};
