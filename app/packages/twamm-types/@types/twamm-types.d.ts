/// <reference types="bn.js" />
declare type Counter = BN;

declare type OrderTypeStruct = { sell: {} } & { buy: {} };

declare type PoolStatusStruct = { expired: {} } & { inactive: {} } & {
  active: {};
};

declare type TIF = number;

declare type TIFIndex = number;
