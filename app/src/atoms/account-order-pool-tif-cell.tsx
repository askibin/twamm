import type { PublicKey } from "@solana/web3.js";
import type { GridCellParams } from "@mui/x-data-grid-pro";
import Maybe from "easy-maybe/lib";
import { lensPath, view } from "ramda";

import { formatInterval } from "../utils/index";
import usePoolWithPair from "../hooks/use-pool-with-pair";

export interface Params extends GridCellParams<void, { pool: PublicKey }> {}

const lensPoolTif = lensPath(["pool", "timeInForce"]);

export default ({ row }: Pick<Params, "row">) => {
  const tokenPair = usePoolWithPair(row.pool);

  const mb = Maybe.of(tokenPair.data);
  const mbTif = Maybe.andMap(view(lensPoolTif), mb);
  const tif = Maybe.withDefault("-", mbTif);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{formatInterval(tif)}</>;
};
