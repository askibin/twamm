import swr from "swr";

import { dedupeEach, revalOnFocus } from "../utils/api";
import { useTokenPair } from "./use-token-pair";

const swrKey = (params) => ({
  key: "tokenPairsToSwap",
  params,
});

const fetcher = async ({ params }) => {
  const { pairs } = params;

  return pairs;
};

export const useTokenPairsToSwap = () => {
  const tokenPairs = useTokenPair();
  // TODO: rename to pairs

  const opts = { ...dedupeEach(20e3), ...revalOnFocus() };

  const pairs = tokenPairs.data?.map((pair) => {
    return [pair.configA.mint, pair.configB.mint];
  });

  return swr(pairs && swrKey({ pairs }), fetcher, opts);
};
