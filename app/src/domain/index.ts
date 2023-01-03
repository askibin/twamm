import type { Program } from "@project-serum/anchor";
import { forit } from "a-wait-forit";
import { OrderSide } from "@twamm/types/lib";
import { PublicKey } from "@solana/web3.js";
import { TokenPair } from "@twamm/client.js";

export const populatePairByType = <T = any>(a: T, b: T, type: OrderSide): T[] =>
  type === OrderSide.sell ? [a, b] : [b, a];

export const formatPrice = (a: number, useCurrency = true) => {
  const opts = useCurrency
    ? {
        style: "currency",
        currency: "USD",
      }
    : {};

  return new Intl.NumberFormat("en-US", opts).format(a);
};

export const resolveExchangePair = (program: Program) => {
  const tokenPair = new TokenPair(program);

  const fetchPair = async (pair: [string, string]) => {
    const addressPair: [PublicKey, PublicKey] = [
      new PublicKey(pair[0]),
      new PublicKey(pair[1]),
    ];

    return tokenPair.getPairByPairAddresses(addressPair);
  };

  return async ([a, b]: [TokenInfo, TokenInfo]) => {
    let addressPair: [string, string] = [a.address, b.address];
    const [err, tokenPairData] = await forit(fetchPair(addressPair));

    let assumedType = OrderSide.sell;
    let pair: [TokenInfo, TokenInfo] = [a, b];
    let result;
    if (err) {
      addressPair = [b.address, a.address];
      const [err1, tokenPairData1] = await forit(fetchPair(addressPair));

      if (err1) throw new Error("Can not fetch the pair");
      assumedType = OrderSide.buy;
      pair = [b, a];
      result = tokenPairData1;
    } else {
      result = tokenPairData;
    }

    const exchangePair = [pair, assumedType];

    return {
      tokenPairData: result as TokenPairProgramData,
      exchangePair,
    };
  };
};
