import type { Cluster } from "@solana/web3.js";
import swr from "swr";
import { TOKEN_LIST_URL } from "@jup-ag/core";

import type { APIHook } from "../utils/api";
import { dedupeEach, revalOnFocus, retryFor } from "../utils/api";
import { useBlockchainConnectionContext } from "./use-blockchain-connection-context";

export type JupToken = {
  name: string;
  symbol: string;
  logoURI: string;
  address: string;
  tags: string[] | undefined;
};

const swrKey = (params: { moniker: Cluster }) => ({
  key: "JupTokens",
  params,
});

const hasTag = (t: JupToken, tag: string) => t.tags?.includes(tag);
const isSTL = (t: JupToken) => hasTag(t, "stablecoin");
const isSolana = (t: JupToken) => hasTag(t, "solana");
const isWSol = (t: JupToken) => t.symbol === "SOL";

const fetcher = async ({ params }: ReturnType<typeof swrKey>) => {
  const { moniker } = params;

  const allTokens: Array<JupToken> = await (
    await fetch(TOKEN_LIST_URL[moniker])
  ).json();

  const neededTokens = allTokens
    .filter((t) => isSTL(t) || isSolana(t) || isWSol(t))
    .map(({ name, symbol, logoURI, address }) => ({
      address,
      logoURI,
      name,
      symbol,
    }));

  return neededTokens;
};

export const useJupTokens: APIHook<void, JupToken[]> = () => {
  const { clusters } = useBlockchainConnectionContext();
  const moniker = clusters[0].moniker as "mainnet-beta";

  const opts = { ...dedupeEach(60e3), ...revalOnFocus(), ...retryFor() };

  return swr(swrKey({ moniker }), fetcher, opts);
};
