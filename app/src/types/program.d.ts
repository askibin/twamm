declare type OrderType = "sell" | "buy";

declare type OrderTypeStruct<T = OrderType> = { [key: T]: {} };

declare type PoolCounter = any;

declare type ExchangePair = [TokenPair, OrderType];

declare type TokenPairAccountData = {
  configA: {
    mint: PublicKey | string;
  };
  configB: {
    mint: PublicKey | string;
  };
  currentPoolPresent: boolean[];
  futurePoolPresent: boolean[];
  poolCounters: PoolCounter[];
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

declare type PoolData = {
  buySide: {
    maxFillPrice: number;
    minFillPrice: number;
  };
  expirationTime: BN;
  sellSide: {
    maxFillPrice: number;
    minFillPrice: number;
  };
  timeInForce: number;
  tokenPair: BN;
  // status: { locked: {} }
};

declare type TokenPairPoolData = PoolData;
