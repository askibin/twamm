import M from "easy-maybe/lib";
import { zip } from "ramda";
import { isFloat } from "../utils/index";

export const format = {
  expirationTime(data: PoolDetails) {
    const value = (({ expirationTime, expired, inactive }) => {
      if (inactive) return "Inactive";
      if (expired) return "Expired";

      return expirationTime.toLocaleString();
    })(data);

    return M.withDefault("-", M.of(value));
  },

  inceptionTime(data: PoolDetails) {
    const value = data.inceptionTime.toLocaleString();

    return M.withDefault("-", M.of(value));
  },

  lastBalanceChangeTime(data: PoolDetails) {
    const value = ((a) =>
      a.lastBalanceChangeTime
        ? M.of(a.lastBalanceChangeTime.toLocaleString())
        : M.of(undefined))(data);

    return M.withDefault<string>("-", value);
  },

  totalAssets(data: PoolDetails) {
    const value = (({ lpSupply, lpSymbols }) =>
      zip(lpSupply, lpSymbols)
        .map((a) => a.join(" "))
        .join(", "))(data);

    return M.withDefault("-", M.of(value));
  },

  // TODO: rework splitting
  prices(data: PoolDetails) {
    const value = data.prices
      .map((price) => (price < 0 ? "-" : price.toFixed(2)))
      .join("|");

    return M.withDefault("-", M.of(value));
  },

  userAveragePrice(data: PoolDetails) {
    const value = (({ prices }) => {
      /*
       *      const baseTokenIndex = side.sell ? 0 : 1;
       *      const supplTokenIndex = side.sell ? 1 : 0;
       *
       *      const withdrawData = withdrawAmount(
       *        withdraw.orderBalance.lpBalance,
       *        withdraw.tradeSide,
       *        withdraw.orderBalance,
       *        withdraw.tokenPair
       *      );
       *
       *      if (!withdrawData[supplTokenIndex]) return undefined;
       *
       *      const avg =
       *        (lpAmount - withdrawData[baseTokenIndex]) /
       *        withdrawData[supplTokenIndex];
       *
       *      return String(isFloat(avg) ? avg.toFixed(2) : avg);
       */
      // eslint-disable-next-line no-nested-ternary
      const avg = isFloat(prices[1])
        ? Number(prices[1]).toFixed(2)
        : prices[1] < 0
        ? "-"
        : prices[1];

      return String(avg);
    })(data);

    return M.withDefault("-", M.of(value));
  },
};