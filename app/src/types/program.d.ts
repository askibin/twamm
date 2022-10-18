declare type OrderType = "sell" | "buy";

declare type OrderTypeStruct = { sell: {} } & { buy: {} };

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

type OrderSide = {
  maxFillPrice: number;
  minFillPrice: number;
  fillsVolume: BN;
};

declare type PoolData = {
  buySide: OrderSide;
  expirationTime: BN;
  sellSide: OrderSide;
  timeInForce: number;
  tokenPair: BN;
  // status: { locked: {} }
};

declare type TokenPairPoolData = PoolData;
