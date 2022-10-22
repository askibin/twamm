import type { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import * as Styled from "./token-pair-cards.styled";
import PairCard, { Blank } from "../atoms/pair-card";
import Maybe, { Extra } from "../../types/maybe";

export interface Props {
  data: TMaybe<TokenPairProgramData[]>;
}

const EmptyCards = () => (
  <Styled.BlankCardList>
    {new Array(3).fill(null).map((_, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <li key={`blank-${i}`}>
        <Blank />
      </li>
    ))}
  </Styled.BlankCardList>
);

type PerfPair = {
  aMint: PublicKey;
  bMint: PublicKey;
  id: string;
  fee: number;
};

const populatePerfPair = (pair: TokenPairProgramData): PerfPair => {
  const { configA, configB, feeNumerator, feeDenominator } = pair;
  const aMint = configA.mint;
  const bMint = configB.mint;
  const fee = feeNumerator.toNumber() / feeDenominator.toNumber();

  return {
    aMint,
    bMint,
    fee,
    id: `${aMint}-${bMint}`,
  };
};

export default ({ data }: Props) => {
  if (Extra.isNothing(data)) return <EmptyCards />;

  const tokenPairs = useMemo(() => {
    const programPairs = Maybe.andMap<TokenPairProgramData[], PerfPair[]>(
      (pairs) => pairs.map(populatePerfPair),
      data
    );

    return Maybe.withDefault([], programPairs);
  }, [data]);

  return (
    <Styled.CardList>
      {tokenPairs.map((tokenPair) => (
        <Styled.CardListItem key={tokenPair.id}>
          <PairCard
            aMint={tokenPair.aMint}
            bMint={tokenPair.bMint}
            perf={0}
            fee={tokenPair.fee}
          />
        </Styled.CardListItem>
      ))}
    </Styled.CardList>
  );
};
