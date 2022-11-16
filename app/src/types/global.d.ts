interface PromiseFulfilledResult<T> {
  status: "fulfilled";
  value: T;
}

interface PromiseRejectedResult {
  status: "rejected";
  reason: any;
}

declare type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

declare type JupToken = {
  name: string;
  decimals: number;
  symbol: string;
  logoURI: string;
  address: string;
  tags: string[] | undefined;
};

declare type JupTokenData = Pick<
  JupToken,
  "name" | "decimals" | "symbol" | "logoURI" | "address"
>;

declare type TokenInfo = JupTokenData & { image: string };

declare type AddressPair = [string, string];

declare type TokenPair<T> = [T, T];

declare type TIF = number;

declare type TIFIndex = number;

declare type IndexedTIF = {
  tif: TIF;
  index: TIFIndex;
  left: number;
};
