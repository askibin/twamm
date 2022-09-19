import type { Provider, Program } from "@project-serum/anchor";
import swr from "swr";
// eslint-disable-next-line import/no-extraneous-dependencies
import { account, program } from "@twamm/client.js";

import { useProgram } from "./use-program";

const fetcher = (
  getProvider: Promise<Provider>,
  getProgram: Promise<Program>
) => {
  const data = account.getEncodedDiscriminator("Order");

  return async () => {
    const provider = await getProvider;
    const program = await getProgram;

    console.log("ws");

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

  return swr("Orders", fetcher(provider, program), {});
};
