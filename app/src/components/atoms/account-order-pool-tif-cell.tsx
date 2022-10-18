import type { PublicKey } from "@solana/web3.js";
import type { GridRenderCellParams } from "@mui/x-data-grid-pro";
import { lensPath, view } from "ramda";

import Maybe from "../../types/maybe";
import { formatInterval } from "../../utils/index";
import { usePoolWithTokenPairByPoolAddress } from "../../hooks/use-pool-with-token-pair-by-pool-address"; // eslint-disable-line max-len

export interface Params
  extends GridRenderCellParams<any, { pool: PublicKey }> {}

const lensPoolTif = lensPath(["pool", "timeInForce"]);

export default ({ row }: Pick<Params, "row">) => {
  const tokenPair = usePoolWithTokenPairByPoolAddress(
    row.pool ? { address: row.pool } : undefined
  );

  const mb = Maybe.of(tokenPair.data);
  const mbTif = Maybe.andMap(view(lensPoolTif), mb);
  const tif = Maybe.withDefault("-", mbTif);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{formatInterval(tif)}</>;
};
