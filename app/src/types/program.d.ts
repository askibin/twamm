declare type OrderType = "sell" | "buy";

declare type OrderTypeStruct = { sell: {} } & { buy: {} };

declare type PairPoolStatusStruct = { expired: {} } & { inactive: {} };

declare type PoolCounter = any;

declare type ExchangePair = [TokenPair, OrderType];

declare type PairTokenStatsData = {
  orderVolumeUsd: number;
};

declare type PairTokenConfigData = {
  mint: PublicKey | string;
  decimals: number;
};

declare type TokenPairAccountData = {
  configA: PairTokenConfigData;
  configB: PairTokenConfigData;
  currentPoolPresent: boolean[];
  feeDenominator: BN;
  feeNumerator: BN;
  futurePoolPresent: boolean[];
  inceptionTime: BN;
  poolCounters: PoolCounter[];
  statsA: PairTokenStatsData;
  statsB: PairTokenStatsData;
  tifs: number[];
};

declare type TokenPairProgramData = TokenPairAccountData;

declare type TokenPairData = Pick<
  TokenPairAccountData,
  "currentPoolPresent" | "futurePoolPresent" | "poolCounters" | "tifs"
> & { exchangePair: ExchangePair };

declare type OrderData = {
  bump: number;
  lastBalanceChangeTime: BN;
  lpBalance: BN;
  owner: PublicKey;
  pool: PublicKey;
  settlementDebt: PublicKey;
  side: OrderTypeStruct;
  time: BN;
  tokenDebt: BN;
  unsettledBalance: BN;
};

type OrderSideData = {
  fillsVolume: BN;
  lastBalanceChangeTime: BN;
  lpSupply: BN;
  maxFillPrice: number;
  minFillPrice: number;
};

declare type PoolData = {
  buySide: OrderSideData;
  expirationTime: BN;
  sellSide: OrderSideData;
  timeInForce: number;
  tokenPair: BN;
  // status: { locked: {} }
  status: PairPoolStatusStruct;
};

declare type TokenPairPoolData = PoolData;

declare type PoolDetails = {
  expirationTime: Date;
  expired: boolean;
  inactive: boolean;
  inceptionTime: Date;
  lastBalanceChangeTime: Date;
  lpSupply: number[];
  lpSymbols: string[];
  prices: string[];
};
