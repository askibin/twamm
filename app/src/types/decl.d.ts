import type { OrderExt, PoolTradeSide, TokenPair } from "@twamm/types";
import {
  populateRow,
  populateDetails,
} from "../organisms/account-orders-list.helpers";

export type OrderData = OrderExt & {
  poolData: PoolData;
  order: PublicKey;
  tokenPairData: TokenPair;
  id: string;
};

export type OrderRecord = ReturnType<typeof populateRow>;

export type OrderDetails = ReturnType<typeof populateDetails>;

export type PoolDetails = {
  aAddress: PublicKey;
  bAddress: PublicKey;
  expirationTime: Date;
  expired: boolean;
  inactive: boolean;
  inceptionTime: Date;
  lastBalanceChangeTime: Date | undefined;
  lpAmount: number;
  lpSupply: number[];
  lpSupplyRaw: number[];
  lpSymbols: string[];
  side: OrderTypeStruct;
  poolAddress: PublicKey;
  prices: number[];
  volume: number;
  withdraw: {
    tradeSide: PoolTradeSide;
    orderBalance: OrderBalanceData;
    tokenPair: TokenPair;
  };
};

export type PairConfig = Pick<TokenPair["configA"], "decimals" | "mint">;

export type PairStats = Pick<
  TokenPair["statsA"],
  "orderVolumeUsd" | "routedVolumeUsd" | "settledVolumeUsd"
>;
