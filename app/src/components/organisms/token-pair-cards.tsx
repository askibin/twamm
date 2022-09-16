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
  console.log(data);

  if (!data) {
    return (
      <Styled.BlankCardList>
        {new Array(3).fill(null).map((_, i) => (
          <li key={i}>
            <Blank key={i} />
          </li>
        ))}
      </Styled.BlankCardList>
    );
  }

  return (
    <Styled.CardList>
      {PAIRS.map((pair) => (
        <Styled.CardListItem key={pair.join("-")}>
          <PairCard name={`${pair[0]}-${pair[1]}`} />
        </Styled.CardListItem>
      ))}
    </Styled.CardList>
  );
};
