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

declare type CancelOrderData = {
  a: PublicKey;
  b: PublicKey;
  expired: boolean;
  inactive: boolean;
  poolAddress: PublicKey;
  side: OrderTypeStruct;
  supply: BN;
};
