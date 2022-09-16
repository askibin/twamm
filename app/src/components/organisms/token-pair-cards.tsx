import PairCard, { Blank } from "../atoms/pair-card";

import * as Styled from "./token-pair-cards.styled";

export interface Props {
  data: any;
}

const PAIRS = [
  ["SOL", "USDC"],
  ["SOL", "USDT"],
  ["USDC", "USDT"],
];

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

  return (
    <Styled.CardList>
      {PAIRS.map((pair) => (
        <Styled.CardListItem key={pair.join("-")}>
          <PairCard name={`${pair[0]}-${pair[1]}`} perf={0} aum={0} />
        </Styled.CardListItem>
      ))}
    </Styled.CardList>
  );
};
