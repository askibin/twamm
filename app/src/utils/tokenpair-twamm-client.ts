import type { Provider, Program } from "@project-serum/anchor";
import { findAddress } from "@twamm/client.js/lib/program";
import { PublicKey } from "@solana/web3.js";

import { forit } from "./forit";
import { poolClient, tokenPairClient } from "./twamm-client";

const addressToBuffer = (address: string) => new PublicKey(address).toBuffer();

export const fetchTokenPair = (provider: Provider, program: Program) => {
  const findProgramAddress = findAddress(program);

  return async (
    pair: AddressPair
  ): Promise<TokenPairProgramData | undefined> => {
    const addressPair = pair.map(addressToBuffer);

    const address = await findProgramAddress("token_pair", addressPair);

    const [error, tokenPair] = await forit(
      program.account.tokenPair.fetch(address)
    );

    return error ? undefined : tokenPair;
  };
};

export const resolveExchangePair = (provider: Provider, program: Program) => {
  const fetchPair = fetchTokenPair(provider, program);

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

export const fetchOrderByPoolAddress = (
  provider: Provider,
  program: Program
) => {
  const tokenPairCli = tokenPairClient(program.account);
  const poolCli = poolClient(program.account);

  return async (address: PublicKey) => {
    const pool = await poolCli.getPool(address);
    const pair = await tokenPairCli.getTokenPair(pool.tokenPair);

    const mints = [pair.configA.mint, pair.configB.mint];

    return { mints };
  };
};
