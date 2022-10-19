import useSWR from "swr";

import { useJupTokens } from "./use-jup-tokens";

const swrKey = (params: { mints: string[] }) => ({
  key: "jupTokensByMint",
  params,
});

const fetcher =
  (tokens?: JupTokenData[]) =>
  async ({ params }: ReturnType<typeof swrKey>) => {
    if (!tokens) return [];

    const { mints } = params;

    const selectedTokens = tokens.filter((token) =>
      mints.includes(token.address)
    );

    return selectedTokens;
  };

export const useJupTokensByMint = (mints: string[], options = {}) => {
  const jupTokens = useJupTokens();

  const isValid = jupTokens.data && mints;

  return useSWR(isValid && swrKey({ mints }), fetcher(jupTokens.data), options);
};
