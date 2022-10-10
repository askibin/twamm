import type { Provider, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import swr from "swr";
import { findAddress } from "@twamm/client.js/lib/program";

import type { APIHook } from "../utils/api";
import { dedupeEach, refreshEach } from "../utils/api";
import { useProgram } from "./use-program";

const swrKey = (params: { aToken: JupToken; bToken: JupToken }) => ({
  key: "tokenPairToSwap",
  params,
});

type Params = Parameters<typeof swrKey>[0];

const fetcher = (provider: Provider, program: Program) => {
  const findProgramAddress = findAddress(program);

  return async ({ params }: ReturnType<typeof swrKey>) => {
    const { aToken, bToken } = params;

    const address = await findProgramAddress("token_pair", [
      new PublicKey(aToken.address).toBuffer(),
      new PublicKey(bToken.address).toBuffer(),
    ]);

    const tokenPair = (await program.account.tokenPair.fetch(
      address
    )) as TokenPairAccountData;

    const { currentPoolPresent, futurePoolPresent, poolCounters, tifs } =
      tokenPair;
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
