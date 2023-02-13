import Box from "@mui/material/Box";
import M from "easy-maybe/lib";
import { useCallback, useMemo, useRef, useState } from "react";

import type { OrderData, OrderDetails, OrderRecord } from "../types/decl.d";
import CancelOrderModal from "../molecules/cancel-order-modal";
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

const initialSortModel: SortModel = [{ field: "orderTime", sort: "asc" }];

export default (props: {
  data?: OrderData[];
  error?: Error;
  loading: boolean;
  updating: boolean;
  updatingInterval: number;
}) => {
  const data = M.withDefault([], M.of(props.data));

  const cancelRef = useRef<Ref>();
  const detailsRef = useRef<Ref>();
  const [accounts, setAccounts] = useState<CancelOrderData | undefined>();
  const [details, setDetails] = useState<OrderDetails>();
  const [selectionModel, setSelectionModel] = useState<SelectionModel>([]);

  const { execute } = useCancelOrder();
  const { isMobile } = useBreakpoints();

  const cols = useMemo<ColDef[]>(() => columns({ isMobile }), [isMobile]);
  const rows = useMemo<OrderRecord[]>(() => data.map(populateRow), [data]);

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
    (params: RowParams<OrderRecord>) => {
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

  return (
    <>
      <UniversalPopover ref={cancelRef}>
        {details && (
          <CancelOrderModal
            data={accounts}
            detailsData={details}
            onApprove={onApproveCancel}
          />
        )}
      </UniversalPopover>
      <UniversalPopover onClose={onDetailsClose} ref={detailsRef}>
        {details && (
          <OrderDetailsModal
            filledQuantity={details.filledQuantity}
            onCancel={onCancelOrder}
            order={details.order}
            poolAddress={details.poolAddress}
            quantity={details.quantity}
            side={details.side}
            supply={details.supply}
            timeInForce={details.timeInForce}
          />
        )}
      </UniversalPopover>
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
