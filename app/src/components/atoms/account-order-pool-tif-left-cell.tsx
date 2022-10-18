import type { PublicKey } from "@solana/web3.js";
import type { BN } from "@project-serum/anchor";
import type { GridRenderCellParams } from "@mui/x-data-grid-pro";
import { lensPath, view } from "ramda";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import Maybe, { Extra } from "../../types/maybe";
import { expirationTimeToInterval, formatInterval } from "../../utils/index";
import { usePoolWithTokenPairByPoolAddress } from "../../hooks/use-pool-with-token-pair-by-pool-address"; // eslint-disable-line max-len

export interface Params
  extends GridRenderCellParams<any, { pool: PublicKey }> {}

const withFormattedExpTime = (data: TMaybe<{ pool: PoolData }>) => {
  const lensPoolTif = lensPath(["pool", "timeInForce"]);
  const lensPoolExpiration = lensPath(["pool", "expirationTime"]);
  const selectTif = view(lensPoolTif);
  const selectExpTime = view(lensPoolExpiration);

  const tif = Maybe.andMap<any, number>(selectTif, data);
  const expirationBN = Maybe.andMap<any, BN>(selectExpTime, data);
  const expirationTime = Maybe.andMap((bn) => bn.toNumber(), expirationBN);
  const expTif = Extra.combine([expirationTime, tif]);

  const timeLeft = Maybe.andMap(([a, b]) => {
    const left = expirationTimeToInterval(a, b);

    if (!left) return "Expired";

    return formatInterval(left);
  }, expTif);

  return timeLeft;
};

export default ({ row }: Pick<Params, "row">) => {
  const tokenPair = usePoolWithTokenPairByPoolAddress(
    row.pool ? { address: row.pool } : undefined
  );

  const data = Maybe.of(tokenPair.data);
  const formattedData = Extra.as(withFormattedExpTime, data);
  const timeLeft = Maybe.withDefault("-", formattedData);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{timeLeft}</>;
};
