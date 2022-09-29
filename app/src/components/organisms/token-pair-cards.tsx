import { useMemo } from "react";

import PairCard, { Blank } from "../atoms/pair-card";
import * as Styled from "./token-pair-cards.styled";

export interface Props {
  data?: Array<any>;
}

// const PAIRS = [
// ["SOL", "USDC"],
// ["SOL", "USDT"],
// ["USDC", "USDT"],
// ];

export default ({ data }: Props) => {
  if (!data) {
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
  }

  const tokenPairs = useMemo(() => {
    const pairs: Array<{ id: string; fee: number }> = [];

    data.forEach((pair: any, i: number) => {
      const { configA, configB, feeNumerator, feeDenominator } = pair;

      const aMint = configA.mint.toBase58();
      const bMint = configB.mint.toBase58();
      const numerator = feeNumerator.toNumber();
      const denominator = feeDenominator.toNumber();

      const fee = numerator / denominator;

      pairs[i] = {
        id: `${aMint}-${bMint}`,
        fee,
      };
    });

    return pairs;
  }, [data]);

  return (
    <Styled.CardList>
      {/* PAIRS.map((pair) => (
        <Styled.CardListItem key={pair.join("-")}>
          <PairCard name={`${pair[0]}-${pair[1]}`} perf={0} aum={0} />
        </Styled.CardListItem>
      )) */}
      {tokenPairs.map((tokenPair) => (
        <Styled.CardListItem key={tokenPair.id}>
          <PairCard name="A-B" perf={0} fee={tokenPair.fee} />
        </Styled.CardListItem>
      ))}
    </Styled.CardList>
  );
};
