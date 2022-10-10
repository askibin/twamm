import type { Program } from "@project-serum/anchor";
import swr from "swr";
import { Pool } from "@twamm/client.js";

import { dedupeEach, fetchJSONFromAPI2, revalOnFocus } from "../utils/api";
import { useCoingeckoContractApi } from "./use-coingecko-api";
import { useProgram } from "./use-program";
import { useTokenPair } from "./use-token-pair";

const swrKey = (params: [string, string]) => ({
  key: "tokenPairByMint",
  params,
});

const fetcher = (
  program: Program,
  tokenPair: any,
  api: ReturnType<typeof useCoingeckoContractApi>
) => {
  const fetchFromAPI = fetchJSONFromAPI2(api);

  return async (params: ReturnType<typeof swrKey>["params"]) => {
    if (!tokenPair.data || tokenPair.error) {
      throw new Error("Can not fetch tokenPair");
    }

    const [mintA, mintB] = params;

    const availableMints: [string, string] = tokenPair.data.map((pair: any) => [
      pair.configA.mint,
      pair.configB.mint,
    ]);

    let isMatchedByMints = false;
    availableMints.forEach((mints) => {
      if (
        !isMatchedByMints &&
        mints.includes(params.mintA) &&
        mints.includes(params.mintB)
      ) {
        isMatchedByMints = true;
      }
    });

    const pairsData = tokenPair.data;
    const pair = pairsData[0];

    const pool = new Pool(program, pair.configA.mint, pair.configB.mint);

    await pool.init();

    // improve pool fetching by tif
    const poolData = await pool.getPool(pair.tifs[1], pair.poolCounters[1]);

    return poolData;
  };
};

export const useTokenPairByMints = (params: [string, string], options = {}) => {
  const { program } = useProgram();
  const tokenPair = useTokenPair();
  const api = useCoingeckoContractApi();

  const opts = { ...dedupeEach(5e3), ...revalOnFocus(), ...options };

  const isValid = !tokenPair.isValidating;

  return swr(isValid && swrKey(params), fetcher(program, tokenPair, api), opts);
};
