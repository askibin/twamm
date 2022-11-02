import useSWR from "swr";
import { useWallet } from "@solana/wallet-adapter-react";

import useTokenPairs from "./use-token-pairs";
import { address as addr } from "../utils/twamm-client";

export default (_: void, options = {}) => {
  const { data } = useTokenPairs();
  const { publicKey: address } = useWallet();

  return useSWR(
    data && ["addressPairs", address],
    async () => {
      if (!data) return undefined;

      const pairs = data.map((pair) => [pair.configA.mint, pair.configB.mint]);

      const addressPairs = pairs.map((pair) => {
        const [a, b] = pair;

        const a1 = addr(a).toString();
        const b1 = addr(b).toString();

        return [a1, b1] as AddressPair;
      });

      return addressPairs;
    },
    options
  );
};
