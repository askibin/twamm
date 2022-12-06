import type { Cluster } from "@solana/web3.js";
import useSWR from "swr";
import { TOKEN_LIST_URL } from "@jup-ag/core";
import { SplToken } from "@twamm/client.js/lib/spl-token";

import useBlockchainConnectionContext from "./use-blockchain-connection-context";

const swrKey = (params: { moniker: Cluster }) => ({
  key: "JupTokens",
  params,
});

const hasTag = (t: JupToken, tag: string) => t.tags?.includes(tag);
const isSTL = (t: JupToken) => hasTag(t, "stablecoin");
const isSolana = (t: JupToken) => hasTag(t, "solana");
const isWSol = (t: JupToken) => SplToken.isNativeAddress(t.address);

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

export default (_: void, options = {}) => {
  const { clusters } = useBlockchainConnectionContext();
  const moniker = clusters[0].moniker as "mainnet-beta";

  return useSWR(swrKey({ moniker }), fetcher, options);
};
