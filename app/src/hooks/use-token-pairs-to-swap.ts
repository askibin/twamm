import { PublicKey } from "@solana/web3.js";
import swr from "swr";
import type { APIHook } from "../utils/api";
import { dedupeEach, revalOnFocus } from "../utils/api";
import { useTokenPairs } from "./use-token-pairs";

type KeyPair = [PublicKey, PublicKey] | AddressPair;

const swrKey = (params: { pairs: KeyPair[] }) => ({
  key: "tokenPairsToSwap",
  params,
});

const fetcher = async ({ params }: ReturnType<typeof swrKey>) => {
  const { pairs } = params;

  const validPairs: AddressPair[] = pairs.map((pair) => {
    const [a, b] = pair;

    // @ts-ignore
    const a1 = a.toBase58 ? (a as PublicKey).toBase58() : a;
    // @ts-ignore
    const b1 = b.toBase58 ? (b as PublicKey).toBase58() : b;

    return [a1, b1] as AddressPair;
  });

  return validPairs;
};

export const useTokenPairsToSwap: APIHook<void, AddressPair[]> = (
  _,
  options = {}
) => {
  const tokenPairs = useTokenPairs();

  const opts = { ...dedupeEach(20e3), ...revalOnFocus(), ...options };

  const pairs = tokenPairs.data?.map(
    (pair): KeyPair => [pair.configA.mint, pair.configB.mint]
  );

  return swr(pairs && swrKey({ pairs }), fetcher, opts);
};
