import type {
  Revalidator,
  RevalidatorOptions,
  SWRConfiguration,
  SWRResponse,
} from "swr";

import type { CoingeckoApiContextType } from "../contexts/coingecko-api-context";
import { CoinsApi as Api } from "../api/coingecko/api";

export declare type CoingeckoApi = CoingeckoApiContextType["api"];

interface PromiseFulfilledResult<T> {
  status: "fulfilled";
  value: T;
}

interface PromiseRejectedResult {
  status: "rejected";
  reason: any;
}

export declare type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

export declare interface APIHook<A, R, O = any> {
  (arg0: A, options?: O): SWRResponse<R>;
  (arg0?: A): SWRResponse<R>;
}

export function fetchJSONFromAPI<Key extends keyof Api>(api: Api) {
  return async function fetchFromAPI<T>(method: Key, ...args: any): Promise<T> {
    const fn = api[method];
    // FIXME: V
    // @ts-ignore
    const resp = await fn.apply(api, args);
    return resp.json();
  };
}

export function fetchJSONFromAPI2<APIType>(api: APIType) {
  return async function fetchFromAPI<T>(
    method: keyof APIType,
    ...args: any
  ): Promise<T> {
    const fn = api[method];
    // FIXME: V
    // @ts-ignore
    const resp = await fn.apply(api, args);
    return resp.json();
  };
}

export const dedupeEach = (interval = 2000) => ({
  dedupingInterval: interval,
});

export const revalOnFocus = (shouldRevalidate = false) => ({
  revalidateOnFocus: shouldRevalidate,
});

export const retryFor = (interval = 10000, retryAttempts = 10) => ({
  refreshInterval: interval,
  onErrorRetry: (
    resp: Response,
    key: string,
    configuration: SWRConfiguration,
    revalidate: Revalidator,
    revalidatorOpts: Required<RevalidatorOptions>
  ) => {
    const { refreshInterval } = configuration;
    const { retryCount } = revalidatorOpts;

    // That might be the issue one time. Think about stop retrying at some point
    if (resp.status === 404 || retryCount > retryAttempts) {
      return;
    }

    const retryIn =
      typeof refreshInterval === "number" ? refreshInterval : interval;

    setTimeout(revalidate, retryIn, { retryCount });
  },
});
