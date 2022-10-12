declare type OrderType = "sell" | "buy";

declare type PoolCounter = any;

declare type ExchangePair = [TokenPair, OrderType];

declare type TokenPairAccountData = {
  configA: {
    mint: string;
  };
  configB: {
    mint: string;
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
