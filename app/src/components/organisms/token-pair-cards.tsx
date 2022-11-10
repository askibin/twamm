import Alert from "@mui/material/Alert";
import Maybe from "easy-maybe/lib";
import { useMemo } from "react";

import * as Styled from "./token-pair-cards.styled";
import PairCard from "../atoms/pair-card";
import { populate } from "./token-pair-cards.helpers";

export interface Props {
  data: Voidable<TokenPairProgramData[]>;
}

export default ({ data }: Props) => {
  const tokenPairs = useMemo(() => {
    const programPairs = Maybe.andMap<TokenPairProgramData[], PerfPair[]>(
      (pairs) => pairs.map(populate),
      Maybe.of(data)
    );

    return Maybe.withDefault([], programPairs);
  }, [data]);

  if (!tokenPairs.length)
    return (
      <Styled.CardList>
        <Alert severity="info">No Pairs Present</Alert>
      </Styled.CardList>
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
            settleVolume={tokenPair.settleVolume}
            tradeVolume={tokenPair.tradeVolume}
          />
        </Styled.CardListItem>
      ))}
    </Styled.CardList>
  );
};
