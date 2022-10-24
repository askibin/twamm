import { useMemo } from "react";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import * as Styled from "./token-pair-cards.styled";
import Maybe, { Extra } from "../../types/maybe";
import PairCard, { Blank } from "../atoms/pair-card";
import { populate } from "./token-pair-cards.helpers";

export interface Props {
  data: TMaybe<TokenPairProgramData[]>;
}

export default ({ data }: Props) => {
  const tokenPairs = useMemo(() => {
    const programPairs = Maybe.andMap<TokenPairProgramData[], PerfPair[]>(
      (pairs) => pairs.map(populate),
      data
    );

    return Maybe.withDefault([], programPairs);
  }, [data]);

  if (Extra.isNothing(data))
    return (
      <Styled.BlankCardList>
        {new Array(3).fill(null).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={`blank-${i}`}>
            <Blank />
          </li>
        ))}
      </Styled.BlankCardList>
    );

  return (
    <Styled.CardList>
      {tokenPairs.map((tokenPair) => (
        <Styled.CardListItem key={tokenPair.id}>
          <PairCard
            aMint={tokenPair.aMint}
            bMint={tokenPair.bMint}
            fee={tokenPair.fee}
            orderVolume={tokenPair.orderVolume}
            perf={tokenPair.orderVolume}
            settleVolume={tokenPair.settleVolume}
            tradeVolume={tokenPair.tradeVolume}
          />
        </Styled.CardListItem>
      ))}
    </Styled.CardList>
  );
};
