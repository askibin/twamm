import type { Program } from "@project-serum/anchor";
import { findAddress } from "@twamm/client.js/lib/program";
import { PublicKey } from "@solana/web3.js";
import { TokenPair as TokenPairClient } from "@twamm/client.js";

import { forit } from "./forit";

const addressToBuffer = (address: string) => new PublicKey(address).toBuffer();

const fetchTokenPair = (program: Program) => {
  const findProgramAddress = findAddress(program);
  const tokenPairClient = new TokenPairClient(program);

  return async (
    pair: AddressPair
  ): Promise<TokenPairProgramData | undefined> => {
    const addressPair = pair.map(addressToBuffer);

    const address = await findProgramAddress("token_pair", addressPair);

    const [error, tokenPair] = await forit(tokenPairClient.getPair(address));

    return error ? undefined : tokenPair;
  };
};

export const resolveExchangePair = (program: Program) => {
  const fetchPair = fetchTokenPair(program);

  return async ([a, b]: TokenPair<TokenInfo>): Promise<{
    exchangePair: ExchangePair;
    tokenPairData: TokenPairProgramData;
  }> => {
    let addressPair: AddressPair = [a.address, b.address];
    let pair: TokenPair<TokenInfo> = [a, b];
    let tokenPairProgramData = await fetchPair(addressPair);

    if (!tokenPairProgramData) {
      addressPair = [b.address, a.address];
      pair = [b, a];
      tokenPairProgramData = await fetchPair(addressPair);
    }

    const assumedType = a.address === pair[0].address ? "sell" : "buy";
    const exchangePair: [TokenPair<TokenInfo>, OrderType] = [pair, assumedType];

    return {
      tokenPairData: tokenPairProgramData as TokenPairProgramData,
      exchangePair,
    };
  };
};
