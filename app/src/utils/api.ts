import { CoinsApi as Api } from "../api/coingecko/api";

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
