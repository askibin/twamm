import type { Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import Maybe, { Extra } from "easy-maybe/lib";
import { TokenPair } from "@twamm/client.js";

import usePool from "./use-pool";
import useProgram from "./use-program";

const { andMap, of, withDefault } = Maybe;

const swrKey = (params: { address: PublicKey; tokenPair: PublicKey }) => ({
  key: "tokenPairByPool",
  params,
});

type Params = Parameters<typeof swrKey>[0];

const fetcher = (program: Program) => {
  const pair = new TokenPair(program);

  return async ({ params: { tokenPair } }: ReturnType<typeof swrKey>) => {
    const tp: unknown = await pair.getPair(tokenPair);

    return tp as TokenPairProgramData;
  };
};

export default (address?: Params["address"], options = {}) => {
  const { program } = useProgram();

  const pool = usePool(withDefault(undefined, of(address)));

  return useSWR(
    withDefault(
      undefined,
      andMap(
        ([a, p]) => swrKey({ address: a, tokenPair: p.tokenPair }),
        Extra.combine2([of(address), of(pool.data)])
      )
    ),
    fetcher(program),
    options
  );
};
