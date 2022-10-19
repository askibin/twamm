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

declare type AddressPair = [string, string];

declare type TokenPair = [JupToken, JupToken];

declare type TIF = number;

declare type TIFIndex = number;

declare type IndexedTIF = {
  tif: TIF;
  index: TIFIndex;
  left: number;
};
