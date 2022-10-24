import Alert from "@mui/material/Alert";
import { useMemo } from "react";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import * as Styled from "./token-pair-cards.styled";
import Maybe from "../../types/maybe";
import PairCard from "../atoms/pair-card";
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
            perf={tokenPair.orderVolume}
            settleVolume={tokenPair.settleVolume}
            tradeVolume={tokenPair.tradeVolume}
          />
        </Styled.CardListItem>
      ))}
    </Styled.CardList>
  );
};
