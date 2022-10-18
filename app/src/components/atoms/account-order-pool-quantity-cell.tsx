import type { GridRenderCellParams } from "@mui/x-data-grid-pro";

import Maybe from "../../types/maybe";
import { usePoolWithTokenPairByPoolAddress } from "../../hooks/use-pool-with-token-pair-by-pool-address"; // eslint-disable-line max-len

export interface Params extends GridRenderCellParams<OrderTypeStruct> {}

export default ({ row, value }: Pick<Params, "row" | "value">) => {
  const tokenPair = usePoolWithTokenPairByPoolAddress(
    row.pool ? { address: row.pool } : undefined
  );

  const data = Maybe.of(tokenPair.data?.pool);

  if (!value) return <>-</>;

  const orderData = Maybe.andMap((pool) => {
    if (!pool) return "-";

    // const orderTypeData = value.sell ? pool.sellSide : pool.buySide;

    return 0;
  }, data);

  const quantity = Maybe.withDefault("-", orderData);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{quantity}</>;
};
