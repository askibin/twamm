declare type JupToken = {
  name: string;
  decimals: number;
  symbol: string;
  logoURI: string;
  address: string;
  tags: string[] | undefined;
};

declare type TokenPair = [string, string];
