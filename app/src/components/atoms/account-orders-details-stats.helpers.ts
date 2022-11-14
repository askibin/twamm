import Maybe from "easy-maybe/lib";
import { zip } from "ramda";
import { isFloat } from "../../utils/index";
import { withdrawAmount } from "../../utils/twamm-client";

const { withDefault, of } = Maybe;

export const format = {
  expirationTime(data: PoolDetails) {
    const value = (({ expirationTime, expired, inactive }) => {
      if (inactive) return "Inactive";
      if (expired) return "Expired";

      return expirationTime.toLocaleString();
    })(data);

    return withDefault("-", of(value));
  },

  inceptionTime(data: PoolDetails) {
    const value = data.inceptionTime.toLocaleString();

    return withDefault("-", of(value));
  },

  lastBalanceChangeTime(data: PoolDetails) {
    const value = ((a) =>
      a.lastBalanceChangeTime
        ? of(a.lastBalanceChangeTime.toLocaleString())
        : of(undefined))(data);

    return withDefault<string>("-", value);
  },

  totalAssets(data: PoolDetails) {
    const value = (({ lpSupply, lpSymbols }) =>
      zip(lpSupply, lpSymbols)
        .map((a) => a.join(" "))
        .join(", "))(data);

    return withDefault("-", of(value));
  },

  // TODO: rework splitting
  prices(data: PoolDetails) {
    const value = data.prices.join("|");

    return withDefault("-", of(value));
  },

  userAveragePrice(data: PoolDetails) {
    const value = (({ lpAmount, side, withdraw }) => {
      const baseTokenIndex = side.sell ? 0 : 1;
      const supplTokenIndex = side.sell ? 1 : 0;

      const withdrawData = withdrawAmount(
        withdraw.orderBalance.lpBalance,
        withdraw.tradeSide,
        withdraw.orderBalance,
        withdraw.tokenPair
      );

      if (!withdrawData[supplTokenIndex]) return undefined;

      const avg =
        (lpAmount - withdrawData[baseTokenIndex]) /
        withdrawData[supplTokenIndex];

      return String(isFloat(avg) ? avg.toFixed(2) : avg);
    })(data);

    return withDefault("-", of(value));
  },
};
