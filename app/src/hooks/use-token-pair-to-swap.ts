import type { Provider, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import swr from "swr";
import { findAddress } from "@twamm/client.js/lib/program";
import { forit } from "../utils/forit";

import type { APIHook } from "../utils/api";
import { dedupeEach, refreshEach } from "../utils/api";
import { useProgram } from "./use-program";

const swrKey = (params: { aToken: JupToken; bToken: JupToken }) => ({
  key: "tokenPairToSwap",
  params,
});

type Params = Parameters<typeof swrKey>[0];

const mintToBuffer = (mint: string) => new PublicKey(mint).toBuffer();

const fetchTokenPair =
  (program: Program, findProgramAddress: any) =>
  async (
    mints: [string, string]
  ): Promise<TokenPairAccountData | undefined> => {
    const addressPair = mints.map(mintToBuffer);

    const address = await findProgramAddress("token_pair", addressPair);

    const tokenPair = (await forit(
      program.account.tokenPair.fetch(address)
    )) as [Error | undefined, TokenPairAccountData | undefined];

    return !tokenPair[1] ? undefined : tokenPair[1];
  };

const fetcher = (provider: Provider, program: Program) => {
  const findProgramAddress = findAddress(program);

  return async ({ params }: ReturnType<typeof swrKey>) => {
    const { aToken, bToken } = params;

    // TODO: resolve the side according the fetched result

    let tokenPair = await fetchTokenPair(
      program,
      findProgramAddress
    )([aToken.address, bToken.address]);

    if (!tokenPair) {
      tokenPair = await fetchTokenPair(
        program,
        findProgramAddress
      )([bToken.address, aToken.address]);
    }

    const { currentPoolPresent, futurePoolPresent, poolCounters, tifs } =
      tokenPair as TokenPairAccountData;

    const pair = {
      currentPoolPresent,
      futurePoolPresent,
      poolCounters,
      tifs,
    };

    return pair;
  };
};

export const useTokenPair: APIHook<Params, TokenPairData> = (
  params,
  options = {}
) => {
  const { provider, program } = useProgram();

  const opts = { ...dedupeEach(30e3), ...refreshEach(), ...options };
  // Should continiously update the pair to fetch actual data

  return swr(params && swrKey(params), fetcher(provider, program), opts);
};
