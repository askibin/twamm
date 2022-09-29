import useSWR from "swr";

import type { APIHook, CoingeckoApi } from "../utils/api";
import { dedupeEach, fetchJSONFromAPI } from "../utils/api";
import { useCoingeckoApi } from "./use-coingecko-api";

type MarketCoin = {
  current_price: number;
  id: string;
  image: string;
  last_updated: string;
  name: string;
  symbol: string;
};

export type MarketCoins = Array<MarketCoin>;

export type MarketCoinRecords = Record<string, MarketCoin>;

const swrKey = (params: {
  vs_currency: string;
  ids?: string;
  category: string[];
}) => ({ key: "coins", params });

type SWRKeyType = ReturnType<typeof swrKey>;

// type Params = Parameters<typeof swrKey>[0];

const fetcher = (api: CoingeckoApi) => {
  const fetchFromAPI = fetchJSONFromAPI(api);
  const fetchCoins = (...args: any) =>
    fetchFromAPI<MarketCoins>("coinsMarketsGet", ...args);

  return async ({ params: { vs_currency, ids, category } }: SWRKeyType) => {
    const coins = await fetchCoins(vs_currency, ids, category[0]);
    const solanaCoins = await fetchCoins(vs_currency, ids, category[1]);

    const coinRecords: MarketCoinRecords = {};

    coins.forEach((coin) => {
      coinRecords[coin.symbol] = coin;
    });

    solanaCoins.forEach((coin) => {
      coinRecords[coin.symbol] = coin;
    });

    return coinRecords;
  };
};

export const useCoins: APIHook<void, MarketCoinRecords> = (_, options = {}) => {
  const api = useCoingeckoApi();

  const opts = { ...dedupeEach(), ...options };

  const vsCurrency = "usd";
  const ids = "sol";
  const category = ["stablecoins", "solana-ecosystem"];

  const params = { vs_currency: vsCurrency, ids, category };

  return useSWR(swrKey(params), fetcher(api), opts);
};
