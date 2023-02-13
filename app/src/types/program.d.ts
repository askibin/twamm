/// <reference types="@twamm/types" />
declare type OrderBalanceData = {
  address: PublicKey;
  lpBalance: BN;
  side: OrderTypeStruct;
  tokenDebt: BN;
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

declare type _DetailsData = {
  poolAddress: PublicKey;
  side: OrderTypeStruct;
  supply: BN;
  order: OrderBalanceData;
};
