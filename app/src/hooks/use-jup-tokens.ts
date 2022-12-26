import type { Cluster } from "@solana/web3.js";
import useSWR from "swr";
import { TOKEN_LIST_URL } from "@jup-ag/core";
import { SplToken } from "@twamm/client.js/lib/spl-token";
import useBlockchain from "../contexts/solana-connection-context";

const swrKey = (params: { moniker: Cluster }) => ({
  key: "JupTokens",
  params,
});

// @ts-expect-error
const hasTag = (t: JupToken, tag: string) => t.tags?.includes(tag);
const isSTL = (t: JupToken) => hasTag(t, "stablecoin");
const isSolana = (t: JupToken) => hasTag(t, "solana");
const isSol = (t: JupToken) => SplToken.isNativeAddress(t.address);
const hasProperAddress = (t: JupToken) =>
  [
    "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  ].includes(t.address);

const fetcher = async ({ params }: ReturnType<typeof swrKey>) => {
  const { moniker } = params;

  const allTokens: Array<JupToken> = await (
    await fetch(TOKEN_LIST_URL[moniker])
  ).json();

  const neededTokens = allTokens
    .filter((t) =>
      // @ts-expect-error
      t?.tags
        ? isSTL(t) || isSolana(t) || isSol(t)
        : hasProperAddress(t) || isSol(t)
    )
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
  const { clusters } = useBlockchain();
  const moniker = clusters[0].moniker as "mainnet-beta";

  return useSWR(swrKey({ moniker }), fetcher, options);
};
