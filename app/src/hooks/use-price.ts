import type { Address } from "@project-serum/anchor";
import useSWR from "swr";

const ENDPOINT = "https://price.jup.ag/v1/price";
// TODO: move addr to the env

type Params = { id: string } & Partial<{
  vsToken: string;
  vsAmount: string;
}>;

type TokenPrice = {
  timeTaken: number;
  contextSlot: string;
  data: {
    id: Extract<Address, string>;
    mintSymbol: string;
    vsToken: Extract<Address, string>;
    vsTokenSymbol: string;
    price: number;
  };
};

const swrKey = (params: Params) => ({
  key: "price",
  params,
});

const fetcher =
  ({ endpoint }: { endpoint: string }) =>
  async ({ params }: { params: Params }) => {
    const resp = await fetch(`${endpoint}?${new URLSearchParams(params)}`);

    if (resp.status === 404) {
      return 0;
    }

    if (resp.status !== 200) {
      throw new Error("Can not fetch the price");
    }

    const data: TokenPrice = await resp.json();

    return data.data.price;
  };

export default (params: Voidable<Params>, options = {}) => {
  const opts = { endpoint: ENDPOINT };

  return useSWR(params && swrKey(params), fetcher(opts), options);
};
