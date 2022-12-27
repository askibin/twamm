import type { BN } from "@project-serum/anchor";
import type { GridCellParams } from "@mui/x-data-grid-pro";
import type { Maybe as TMaybe } from "easy-maybe";
import type { PublicKey } from "@solana/web3.js";
import Maybe, { Extra } from "easy-maybe/lib";
import { lensPath, view } from "ramda";

import usePoolWithPair from "../hooks/use-pool-with-pair";
import { expirationTimeToInterval, formatInterval } from "../utils/index";

export interface Params extends GridCellParams<void, { pool: PublicKey }> {}

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

    if (!left) return "Done";

    return formatInterval(left);
  }, expTif);

  return timeLeft;
};

export default ({ row }: Pick<Params, "row">) => {
  const tokenPair = usePoolWithPair(row.pool);

  const data = Maybe.of(tokenPair.data);
  const formattedData = Extra.as(withFormattedExpTime, data);
  const timeLeft = Maybe.withDefault("-", formattedData);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{timeLeft}</>;
};
