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

declare type FetcherArgs<T> = { params: T };

declare type JupTokenData = {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  tags: string[] | undefined;
};

declare type JupTokenDataV2 = {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  extensions: {} | undefined;
};

declare type CoinToken = Pick<
  JupTokenDataV2,
  "address" | "decimals" | "name" | "symbol"
>;

declare type JupToken = CoinToken & Pick<JupTokenDataV2, "logoURI">;

declare type TokenInfo = JupToken & { image: string };

declare type AddressPair = [string, string];

declare type TokenPair<T> = [T, T];

declare type TIF = number;

declare type TIFIndex = number;

declare type IndexedTIF = {
  tif: TIF;
  index: TIFIndex;
  left: number;
};
