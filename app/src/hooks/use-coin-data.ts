import useSWR from "swr";
import type { APIHook, CoingeckoApi } from "../utils/api";
import { fetchJSONFromAPI } from "../utils/api";

import { useCoingeckoApi } from "./use-coingecko-api";

type Coin = {
  id: string;
  last_updated: string;
  name: string;
  symbol: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
};

const swrKey = (params: {
  community_data: boolean;
  developer_data: boolean;
  id: string;
  localization: boolean;
  market_data: boolean;
  tickers: boolean;
}) => ({ key: "coin", params });

type SWRKeyType = ReturnType<typeof swrKey>;

// type Params = Parameters<typeof swrKey>[0];

const fetcher = (api: CoingeckoApi) => {
  const fetchFromAPI = fetchJSONFromAPI(api);
  const fetchCoin = (...args: any) => fetchFromAPI<Coin>("coinsIdGet", ...args);

  return async ({
    params: {
      community_data,
      developer_data,
      id,
      localization,
      market_data,
      tickers,
    },
  }: SWRKeyType) => {
    const coin = await fetchCoin(
      id,
      localization,
      tickers,
      market_data,
      community_data,
      developer_data
    );

    return coin;
  };
};

export const useCoinData: APIHook<{ id: string }, Coin> = (
  params,
  options = {}
) => {
  const api = useCoingeckoApi();

  const params1 = params?.id
    ? {
        community_data: false,
        developer_data: false,
        id: params.id,
        localization: false,
        market_data: false,
        tickers: false,
      }
    : undefined;

  return useSWR(params1 && swrKey(params1), fetcher(api), options);
};
