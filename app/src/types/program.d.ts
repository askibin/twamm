declare type OrderType = "sell" | "buy";

declare type OrderTypeStruct = { sell: {} } & { buy: {} };

declare type PairPoolStatusStruct = { expired: {} } & { inactive: {} };

declare type PoolCounter = any;

declare type ExchangePair = [TokenPair, OrderType];

// TODO: remove type
declare type PairTokenStatsData = {
  orderVolumeUsd: number;
  settleVolumeUsd: number;
  tradeVolumeUsd: number;
};

declare type PairStatsData = PairTokenStatsData;

declare type PairStats = Pick<
  PairStatsData,
  "orderVolumeUsd" | "settleVolumeUsd" | "tradeVolumeUsd"
>;

// TODO: remove type
declare type PairTokenConfigData = {
  mint: PublicKey;
  decimals: number;
};

declare type PairConfigData = PairTokenConfigData;

declare type PairConfig = Pick<PairConfigData, "mint" | "decimals">;

declare type TokenPairAccountData = {
  configA: PairConfigData;
  configB: PairConfigData;
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

declare type PerfPair = {
  aMint: PublicKey;
  bMint: PublicKey;
  fee: number;
  id: string;
  orderVolume: number;
  settleVolume: number;
  tradeVolume: number;
};

declare type OrderData = {
  bump: number;
  lastBalanceChangeTime: BN;
  lpBalance: BN;
  owner: PublicKey;
  pool: PublicKey;
  settlementDebt: BN;
  side: OrderTypeStruct;
  time: BN;
  tokenDebt: BN;
  unsettledBalance: BN;
};

type PoolTradeSideData = {
  fillsVolume: BN;
  lastBalanceChangeTime: BN;
  lpSupply: BN;
  maxFillPrice: number;
  minFillPrice: number;
  sourceBalance: BN;
  targetBalance: BN;
  tokenDebtTotal: BN;
  weightedFillsSum: BN | number;
};

declare type PoolData = {
  buySide: PoolTradeSideData;
  counter: BN;
  expirationTime: BN;
  sellSide: PoolTradeSideData;
  timeInForce: number;
  tokenPair: BN;
  // status: { locked: {} }
  status: PairPoolStatusStruct;
};

declare type TokenPairPoolData = PoolData;

declare type PoolDetails = {
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
  prices: string[];
  volume: number;
  withdrawData: number[];
};

declare type DetailsData = {
  poolAddress: PublicKey;
  side: OrderTypeStruct;
  supply: BN;
  order: {
    lpBalance: BN;
    tokenDebt: BN;
    side: OrderTypeStruct;
  };
};
