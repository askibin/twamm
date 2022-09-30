import Skeleton from "@mui/material/Skeleton";

import * as Styled from "./pair-card-symbols.styled";

export interface PairSymbols {
  data: any;
}

export default ({ data }: PairSymbols) => {
  if (!data) return <Skeleton variant="rectangular">Loading...</Skeleton>;

  const [a, b] = data;

  return (
    <Styled.Root>
      <Styled.TokenAvatarGroup max={2}>
        <Styled.TokenAvatar alt={a.symbol} src={a.imageSmall} />
        <Styled.TokenAvatar alt={b.symbol} src={b.imageSmall} />
      </Styled.TokenAvatarGroup>
      {a.symbol.toUpperCase()}-{b.symbol.toUpperCase()}
    </Styled.Root>
  );
};
