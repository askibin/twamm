import useSWR from "swr";
import M, { Extra } from "easy-maybe/lib";
import useJupTokens from "./use-jup-tokens";

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

export default (mints: string[] | undefined, options = {}) => {
  const jupTokens = useJupTokens();

  return useSWR(
    M.withDefault(
      undefined,
      M.andMap(
        ([m]) => swrKey({ mints: m }),
        Extra.combine2([M.of(mints), M.of(jupTokens.data)])
      )
    ),
    fetcher(jupTokens.data),
    options
  );
};
