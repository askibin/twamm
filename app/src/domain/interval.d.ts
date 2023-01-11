export declare type TIF = number;

export declare type TIFIndex = number;

export declare type IndexedTIF = {
  index: TIFIndex;
  left: number;
  tif: TIF;
};

export declare type PoolTIF =
  | IndexedTIF
  | {
      index: TIFIndex;
      left: number;
      poolStatus: PairPoolStatusStruct | undefined;
      tif: TIF;
    };
