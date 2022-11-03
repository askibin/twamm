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
import OrderDetailsModal from "./account-order-details-modal";
import Table from "../atoms/table";
import UniversalPopover from "../molecules/universal-popover";
import useCancelOrder from "../../hooks/use-cancel-order";
import { address } from "../../utils/twamm-client";
import { columns as cols } from "./account-orders-list.helpers";

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

type DetailsData = {
  address: PublicKey;
  side: OrderTypeStruct;
  supply: BN;
};

const selectOrderData = (params: GridRowParams<RowData>) => ({
  address: params.row.pool,
  side: params.row.side,
  supply: params.row.supply,
});

export default (props: Props) => {
  const d = useMemo(() => Maybe.of(props.data), [props.data]);
  const err = useMemo(() => Maybe.of(props.error), [props.error]);

  const data = Maybe.withDefault([], d);
  const error = Maybe.withDefault(undefined, err);

  const cancelRef = useRef<{ close: () => void; open: () => void }>();
  const detailsRef = useRef<{ open: () => void }>();
  const [accounts, setAccounts] = useState<CancelOrderData | undefined>();
  const [checkboxSelection, setCheckboxSelection] = useState<boolean>(false);
  const [details, setDetails] = useState<DetailsData>();
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
        cancelRef.current?.open();
      }
    },
    [execute, setAccounts]
  );

  const onRowClick = useCallback(
    (params: GridRowParams<RowData>) => {
      setDetails(selectOrderData(params));
      detailsRef.current?.open();
    },
    [setDetails]
  );

  const onDetailsClose = useCallback(() => {
    setDetails(undefined);
  }, []);

  const onApproveCancel = useCallback(
    async (cd: CancelOrderData) => {
      const { a, b, poolAddress, supply } = cd;
      const amount = supply.toNumber();
      await execute({ a, b, poolAddress, amount });

      cancelRef.current?.close();
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

  return (
    <>
      <UniversalPopover ref={cancelRef}>
        <CancelOrder onApprove={onApproveCancel} data={accounts} />
      </UniversalPopover>

      <UniversalPopover onClose={onDetailsClose} ref={detailsRef}>
        {details && (
          <OrderDetailsModal
            address={details.address}
            onCancel={onCancelOrder}
            side={details.side}
            supply={details.supply}
          />
        )}
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
            loading: props.loading,
            onSelectionModelChange,
            rows,
            selectionModel,
          }}
          filterColumnField="pool"
          isUpdating={props.updating}
          onRowClick={onRowClick}
          pagination={false}
          searchBoxPlaceholderText="Search orders"
        />
      </Box>
    </>
  );
};
