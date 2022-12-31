import Box from "@mui/material/Box";
import Maybe from "easy-maybe/lib";
import Stack from "@mui/material/Stack";
import { useCallback, useMemo, useRef, useState } from "react";

import CancelOrder from "../molecules/cancel-order-modal";
import OrderDetailsModal from "./account-order-details-modal";
import RowColumnList, {
  ColDef,
  RowParams,
  SelectionModel,
  SortModel,
} from "./row-column-list";
import UniversalPopover, { Ref } from "../molecules/universal-popover";
import useBreakpoints from "../hooks/use-breakpoints";
import useCancelOrder from "../hooks/use-cancel-order";
import {
  columns,
  populateDetails,
  populateRow,
} from "./account-orders-list.helpers";
import * as Styled from "./account-orders-list.styled";

export interface Props {
  data: Voidable<OrderPoolRecord[]>;
  error: Voidable<Error>;
  loading: boolean;
  updating: boolean;
  updatingInterval: number;
}

type RowData = ReturnType<typeof populateRow>;

type DetailsData = ReturnType<typeof populateDetails>;

const initialSortModel: SortModel = [{ field: "orderTime", sort: "asc" }];

export default (props: Props) => {
  const data = Maybe.withDefault([], Maybe.of(props.data));

  const cancelRef = useRef<Ref>();
  const detailsRef = useRef<Ref>();
  const [accounts, setAccounts] = useState<CancelOrderData | undefined>();
  const [details, setDetails] = useState<DetailsData>();
  const [selectionModel, setSelectionModel] = useState<SelectionModel>([]);

  const { execute, executeMany } = useCancelOrder();
  const { isMobile } = useBreakpoints();

  const cols = useMemo<ColDef[]>(() => columns({ isMobile }), [isMobile]);
  const rows = useMemo<RowData[]>(() => data.map(populateRow), [data]);

  const [sortModel, setSortModel] = useState<SortModel>(initialSortModel);

  const onCancelOrder = useCallback(
    async (cd: CancelOrderData) => {
      const { a, b, inactive, expired, orderAddress, poolAddress, supply } = cd;

      if (inactive || expired) {
        const amount = supply.toNumber();

        detailsRef.current?.close();
        await execute({ a, b, orderAddress, poolAddress, amount });
      } else {
        setAccounts(cd);
        cancelRef.current?.open();
      }
    },
    [execute, setAccounts]
  );

  const onRowClick = useCallback(
    (params: RowParams<RowData>) => {
      setDetails(populateDetails(params));
      detailsRef.current?.open();
    },
    [setDetails]
  );

  const onDetailsClose = useCallback(() => {
    setDetails(undefined);
  }, []);

  const onApproveCancel = useCallback(
    async (cd: CancelOrderData) => {
      const { a, b, orderAddress, poolAddress, supply } = cd;
      const amount = supply.toNumber();

      cancelRef.current?.close();
      detailsRef.current?.close();
      await execute({ a, b, orderAddress, poolAddress, amount });
    },
    [execute]
  );

  const onSelectionModelChange = useCallback(
    (nextSelectionModel: SelectionModel) => {
      setSelectionModel(nextSelectionModel);
    },
    [setSelectionModel]
  );

  const onCancelSelectedOrders = useCallback(async () => {
    if (!selectionModel.length) return;

    const selectedRows = rows.filter((row) => selectionModel.includes(row.id));

    const deletionRows = selectedRows.map((row) => ({
      amount: Number.MAX_SAFE_INTEGER,
      orderAddress: row.order.address,
      poolAddress: row.pool,
    }));

    cancelRef.current?.close();
    await executeMany(deletionRows);

    setSelectionModel([]);
  }, [executeMany, rows, selectionModel, setSelectionModel]);

  return (
    <>
      <UniversalPopover ref={cancelRef}>
        {details && (
          <CancelOrder
            data={accounts}
            detailsData={details}
            onApprove={onApproveCancel}
          />
        )}
      </UniversalPopover>

      <UniversalPopover onClose={onDetailsClose} ref={detailsRef}>
        {details && (
          <OrderDetailsModal
            onCancel={onCancelOrder}
            order={details.order}
            poolAddress={details.poolAddress}
            side={details.side}
            supply={details.supply}
          />
        )}
      </UniversalPopover>

      <Box py={2}>
        <Stack direction="row" spacing={2}>
          <Styled.ControlButton
            variant="outlined"
            onClick={onCancelSelectedOrders}
            disabled={!selectionModel?.length}
          >
            Cancel / Withdraw Selected
          </Styled.ControlButton>
        </Stack>
      </Box>
      <Box>
        <RowColumnList
          checkboxSelection={false}
          columns={cols}
          error={props.error}
          loading={props.loading}
          onRowClick={onRowClick}
          onSelectionModelChange={onSelectionModelChange}
          onSortModelChange={(newSortModel: SortModel) =>
            setSortModel(() => {
              if (!newSortModel.length) return initialSortModel;

              const [defaultField] = initialSortModel;
              const map = new Map([]);
              newSortModel.forEach((model) => {
                map.set(model.field, model);
              });
              if (!map.get(defaultField.field))
                map.set(defaultField.field, defaultField);

              return [...map.values()] as SortModel;
            })
          }
          rows={rows}
          selectionModel={selectionModel}
          sortModel={sortModel}
          updating={props.updating}
          updatingInterval={props.updatingInterval}
        />
      </Box>
    </>
  );
};