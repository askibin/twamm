import Maybe from "easy-maybe/lib";
import { zip } from "ramda";

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

  prices(data: PoolDetails) {
    const value = data.prices.join("/");

    return withDefault("-", of(value));
  },
};
