import type { PoolDetails } from "../../hooks/use-pool-details";
import type { Maybe as TMaybe } from "../../types/maybe.d";
import Maybe from "../../types/maybe";

export const format = {
  expirationTime(data: TMaybe<PoolDetails>) {
    const value = Maybe.andMap(({ expirationTime, expired, inactive }) => {
      if (inactive) return "Inactive";
      if (expired) return "Expired";

      return expirationTime.toLocaleString();
    }, data);

    return Maybe.withDefault("-", value);
  },

  inceptionTime(data: TMaybe<PoolDetails>) {
    const value = Maybe.andMap((a) => a.inceptionTime.toLocaleString(), data);

    return Maybe.withDefault("-", value);
  },

  lastBalanceChangeTime(data: TMaybe<PoolDetails>) {
    const value = Maybe.andMap(
      (a) => a.lastBalanceChangeTime.toLocaleString(),
      data
    );

    return Maybe.withDefault("-", value);
  },

  totalAssets(data: TMaybe<PoolDetails>) {
    const value = Maybe.andMap(({ lpSupply, lpSymbols }) => {
      const lp = [
        `${lpSupply[0]} ${lpSymbols[0]}`,
        `${lpSupply[1]} ${lpSymbols[1]}`,
      ];
      return `${lp[0]}, ${lp[1]}`;
    }, data);

    return Maybe.withDefault("-", value);
  },

  prices(data: TMaybe<PoolDetails>) {
    const value = Maybe.andMap((a) => a.prices.join("/"), data);

    return Maybe.withDefault("-", value);
  },
};
