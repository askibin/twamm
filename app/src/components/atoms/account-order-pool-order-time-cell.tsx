import type { GridCellParams } from "@mui/x-data-grid-pro";

import Maybe from "../../types/maybe";

export interface Params extends GridCellParams<number> {}

export default ({ value }: Pick<Params, "value">) => {
  const data = Maybe.of(value);
  const orderDate = Maybe.andMap(
    (time) => (time ? new Date(time * 1e3) : undefined),
    data
  );
  const orderTime = Maybe.withDefault(undefined, orderDate);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{orderTime ? orderTime.toLocaleString() : "-"}</>;
};
