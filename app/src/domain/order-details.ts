import type { Pool } from "@twamm/types";
import { BN } from "@project-serum/anchor";
import { lensPath, view } from "ramda";

export const quantity = (
  pair: TokenPairProgramData,
  pool: Pool,
  orderType: OrderTypeStruct,
  unsettledBalance: BN
) => {
  const decimals = lensPath(["decimals"]);
  const selling = Boolean(orderType.sell);

  const d = selling
    ? view(decimals, pair.configA)
    : view(decimals, pair.configB);

  return Number(unsettledBalance) / 10 ** d;
};

export const filledQuantity = (
  pair: TokenPairProgramData,
  pool: Pool,
  orderType: OrderTypeStruct
) => {
  const decimals = lensPath(["decimals"]);
  const selling = Boolean(orderType.sell);

  const orderTypeData = selling ? pool.sellSide : pool.buySide;

  const d = selling
    ? view(decimals, pair.configA)
    : view(decimals, pair.configB);

  return Number(orderTypeData.fillsVolume) / 10 ** d;
};
