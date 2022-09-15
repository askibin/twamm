import type { SWRResponse } from "swr";

import type { CoingeckoApiContextType } from "../contexts/coingecko-api-context";
import { CoinsApi as Api } from "../api/coingecko/api";

export declare type CoingeckoApi = CoingeckoApiContextType["api"];

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
