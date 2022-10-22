import type { Cluster } from "@solana/web3.js";
import useSWR from "swr";
import { TOKEN_LIST_URL } from "@jup-ag/core";
import { NATIVE_MINT } from "@solana/spl-token";

import { useBlockchainConnectionContext } from "./use-blockchain-connection-context";

const swrKey = (params: { moniker: Cluster }) => ({
  key: "JupTokens",
  params,
});

const hasTag = (t: JupToken, tag: string) => t.tags?.includes(tag);
const isSTL = (t: JupToken) => hasTag(t, "stablecoin");
const isSolana = (t: JupToken) => hasTag(t, "solana");
const isWSol = (t: JupToken) => t.address === NATIVE_MINT.toBase58();

const fetcher = async ({ params }: ReturnType<typeof swrKey>) => {
  const { moniker } = params;

  const allTokens: Array<JupToken> = await (
    await fetch(TOKEN_LIST_URL[moniker])
  ).json();

  const neededTokens = allTokens
    .filter((t) => isSTL(t) || isSolana(t) || isWSol(t))
    .map(({ address, decimals, logoURI, name, symbol }) => ({
      address,
      decimals,
      logoURI,
      name,
      symbol,
    }));

  return neededTokens;
};

export const useJupTokens = (_: void, options = {}) => {
  const { clusters } = useBlockchainConnectionContext();
  const moniker = clusters[0].moniker as "mainnet-beta";

  return useSWR(swrKey({ moniker }), fetcher, options);
};
