import useSWR from "swr";

import type { APIHook } from "../utils/api";
import { fetchJSONFromAPI2 } from "../utils/api";
import { useCoingeckoContractApi } from "./use-coingecko-api";

const swrKey = (params: { mints: string[] }) => ({
  key: "tokensByMint",
  params,
});

type ContractData = {
  image: {
    large: string;
    small: string;
    thumb: string;
  };
  symbol: string;
  name: string;
  contract_address: string;
};

type Contract = {
  imageSmall: string;
  symbol: string;
  name: string;
  contract_address: string;
};

type MaybeTokens = Array<Contract | Error>;

const fetcher = (api: ReturnType<typeof useCoingeckoContractApi>) => {
  const fetchFromAPI = fetchJSONFromAPI2(api);
  const fetchAddressByMint = (...args: any) =>
    fetchFromAPI<ContractData>("coinsIdContractContractAddressGet", ...args);

  return async ({ params: { mints } }: ReturnType<typeof swrKey>) => {
    const contracts: PromiseSettledResult<ContractData>[] =
      await Promise.allSettled(
        mints.map((mint) => fetchAddressByMint("solana", mint))
      );

    const tokens: MaybeTokens = [];

    contracts.forEach((contract, i) => {
      if (contract.status === "fulfilled") {
        const {
          symbol,
          name,
          contract_address: address,
          image,
        } = contract.value;
        tokens[i] = {
          symbol,
          name,
          contract_address: address,
          imageSmall: image.small,
        };
      }
      if (contract.status === "rejected") {
        tokens[i] = new Error("Unknown token");
      }
    });

    return tokens;
  };
};

export const useTokensByMint: APIHook<string[], MaybeTokens> = (
  params,
  options = {}
) => {
  const api = useCoingeckoContractApi();

  return useSWR(params && swrKey({ mints: params }), fetcher(api), options);
};
