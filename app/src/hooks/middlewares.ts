import type { Fetcher, Key, SWRConfiguration, SWRHook } from "swr";

export function asMiddleware<A, B = any>(fn: (arg0: B) => A) {
  return (useSWRNext: SWRHook) =>
    (key: Key, fetcher: Fetcher, config: SWRConfiguration) => {
      const fetchNext = async (a: any) => {
        const data: unknown = await fetcher(a);

        return fn(data as B);
      };

      return useSWRNext<A>(key, fetchNext, config);
    };
}
