import type { Provider, Program } from "@project-serum/anchor";
import swr from "swr";
import { account } from "@twamm/client.js";

import { dedupeEach } from "../utils/api";
import { useProgram } from "./use-program";

const fetcher = (provider: Provider, program: Program) => {
  const data = account.getEncodedDiscriminator("Order");

  return async () => {
    const pairs = await provider.connection.getProgramAccounts(
      program.programId,
      {
        filters: [{ dataSize: 592 }, { memcmp: { bytes: data, offset: 0 } }],
      }
    );

    const fetchPair = (pair: any) =>
      program.account.tokenPair.fetch(pair.pubkey);

    return Promise.all(pairs.map(fetchPair));
  };
};

export const useOrders = () => {
  const { program, provider } = useProgram();

  return swr("Orders", fetcher(provider, program), dedupeEach());
};
