declare type TIF = number;

declare type TIFIndex = number;

declare type OrderTypeStruct = { sell: {} } & { buy: {} };

declare type PoolStatusStruct = { expired: {} } & { inactive: {} } & {
  active: {};
};
