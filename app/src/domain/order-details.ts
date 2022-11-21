import { lensPath, view } from "ramda";

export const quantity = (
  pair: TokenPairProgramData,
  pool: PoolData,
  orderType: OrderTypeStruct
) => {
  const decimals = lensPath(["decimals"]);
  const selling = Boolean(orderType.sell);

  const orderTypeData = selling ? pool.sellSide : pool.buySide;

  const d = selling
    ? view(decimals, pair.configA)
    : view(decimals, pair.configB);

  return Number(orderTypeData.lpSupply) / 10 ** d;
};

export const filledQuantity = (
  pair: TokenPairProgramData,
  pool: PoolData,
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
