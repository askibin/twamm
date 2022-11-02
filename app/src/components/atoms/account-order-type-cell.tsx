import type { PublicKey } from "@solana/web3.js";
import type { GridCellParams } from "@mui/x-data-grid-pro";
import Maybe from "easy-maybe/lib";

export interface Params
  extends GridCellParams<
    void,
    {
      side: OrderTypeStruct;
      pool: PublicKey;
    }
  > {}

export default ({ row }: Pick<Params, "row">) => {
  const { side } = row;

  const orderType = Maybe.andMap<OrderTypeStruct, string>(
    (s) => (s.sell ? "Sell" : "Buy"),
    Maybe.of(side)
  );

  const sideValue = Maybe.withDefault("-", orderType);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{sideValue}</>;
};
