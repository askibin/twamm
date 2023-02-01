/// <reference types="@twamm/types" />

declare type PoolCounter = Counter;

declare type ExchangePair = [TokenPair, OrderSide];

declare type AccountBalance = {
  pubkey: PublicKey;
  account: {
    executable: boolean;
    lamports: number;
    rentEpoch?: number;
    owner: PublicKey;
    data: {
      program: "spl-token";
      space: number;
      parsed: {
        type: "account";
        info: {
          isNative: boolean;
          mint: string;
          owner: string;
          state: string;
          tokenAmount: {
            amount: string;
            decimals: number;
            uiAmount: number;
            uiAmountString: string;
          };
        };
      };
    };
  };
};

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
  allowDeposits: boolean;
  allowWithdrawals: boolean;
  configA: PairConfigData;
  configB: PairConfigData;
  currentPoolPresent: boolean[];
  feeDenominator: BN;
  feeNumerator: BN;
  futurePoolPresent: boolean[];
  inceptionTime: BN;
  maxSwapPriceDiff: number;
  maxUnsettledAmount: number;
  minTimeTillExpiration: number;
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
  routedVolume: number;
  settledVolume: number;
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

declare type OrderRecord = OrderData & { id: string };

declare type OrderPoolRecord = OrderRecord & { pubkey: PublicKey } & {
  poolData: PoolData;
  order: PublicKey;
  tokenPairData: TokenPairProgramData;
  id: string;
};

declare type OrderBalanceData = {
  address: PublicKey;
  lpBalance: BN;
  side: OrderTypeStruct;
  tokenDebt: BN;
  unsettledBalance: BN;
};

declare type CancelOrderData = {
  a: PublicKey;
  b: PublicKey;
  expired: boolean;
  inactive: boolean;
  orderAddress: PublicKey;
  poolAddress: PublicKey;
  side: OrderTypeStruct;
  supply: BN;
};

declare type CancelOrderWithCountersData = {
  a: PublicKey;
  b: PublicKey;
  supply?: BN; // allow to omit the amount
  counters: {
    tif: TIF;
    tifs: TIF[];
    poolCounters: BN[];
    nextPool: boolean;
  };
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
  tokenPair: PublicKey;
  status: PoolStatusStruct;
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
  prices: number[];
  volume: number;
  withdraw: {
    tradeSide: PoolTradeSideData;
    orderBalance: OrderBalanceData;
    tokenPair: TokenPairProgramData;
  };
};

declare type DetailsData = {
  poolAddress: PublicKey;
  side: OrderTypeStruct;
  supply: BN;
  order: OrderBalanceData;
};
