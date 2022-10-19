import type { PublicKey } from "@solana/web3.js";
import type { Fetcher, Key, SWRConfiguration, SWRHook } from "swr";

export type KeyPair = [PublicKey, PublicKey] | AddressPair;

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

export const withKeypair = asMiddleware<AddressPair[], TokenPairProgramData[]>(
  (data) => {
    const pairs = data.map((pair) => [pair.configA.mint, pair.configB.mint]);

    const addressPairs = pairs.map((pair) => {
      const [a, b] = pair;

      // @ts-ignore
      const a1 = a.toBase58 ? (a as PublicKey).toBase58() : a;
      // @ts-ignore
      const b1 = b.toBase58 ? (b as PublicKey).toBase58() : b;

      return [a1, b1] as AddressPair;
    });

    return addressPairs;
  }
);
