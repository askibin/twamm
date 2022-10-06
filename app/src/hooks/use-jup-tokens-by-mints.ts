import swr from "swr";

import type { APIHook } from "../utils/api";
import type { JupToken } from "./use-jup-tokens";
import { dedupeEach, revalOnFocus } from "../utils/api";
import { useJupTokens } from "./use-jup-tokens";

const swrKey = (params: { mints: string[] }) => ({
  key: "jupTokensByMint",
  params,
});

const fetcher =
  (tokens?: JupToken[]) =>
  async ({ params }: ReturnType<typeof swrKey>) => {
    if (!tokens) return [];

    const { mints } = params;

    const selectedTokens = tokens.filter((token) =>
      mints.includes(token.address)
    );

    return selectedTokens;
  };

export const useJupTokensByMint: APIHook<string[], JupToken[]> = (mints) => {
  const jupTokens = useJupTokens();

  const opts = { ...dedupeEach(60e3), ...revalOnFocus() };

  const isValid = jupTokens.data && mints;

  return swr(isValid && swrKey({ mints }), fetcher(jupTokens.data), opts);
};
