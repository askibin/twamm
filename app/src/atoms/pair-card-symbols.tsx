import Box from "@mui/material/Box";
import Maybe from "easy-maybe/lib";
import Skeleton from "@mui/material/Skeleton";

import type { MaybeTokens } from "../hooks/use-tokens-by-mint";
import * as Styled from "./pair-card-symbols.styled";

export interface Props {
  data: Voidable<MaybeTokens>;
  displayDirection?: boolean;
  side?: OrderTypeStruct;
}

const TokenImage = ({ data }: { data: MaybeTokens[0] }) => {
  if (data instanceof Error)
    return (
      <Styled.TokenAvatar alt="?" src="">
        ?
      </Styled.TokenAvatar>
    );

  return <Styled.TokenAvatar alt={data.symbol} src={data.imageSmall} />;
};

const TokenSymbol = ({ data }: { data: MaybeTokens[0] }) => (
  <span>{data instanceof Error ? "Unknown" : data.symbol.toUpperCase()}</span>
);

export default ({ data, displayDirection, side }: Props) => {
  const mints = Maybe.of(data);
  const tokens = Maybe.withDefault(undefined, mints);

  if (!tokens) return <Skeleton variant="rectangular">Loading...</Skeleton>;

  const [a, b] = tokens;

  const displayTokens = side?.buy && displayDirection ? [b, a] : [a, b];
  const direction = !displayDirection ? "-" : "→";
  return (
    <Styled.Root>
      <Styled.TokenAvatarGroup max={2}>
        <TokenImage data={displayTokens[0]} />
        <TokenImage data={displayTokens[1]} />
      </Styled.TokenAvatarGroup>
      <Box>
        <TokenSymbol data={displayTokens[0]} />
        {direction}
        <TokenSymbol data={displayTokens[1]} />
      </Box>
    </Styled.Root>
  );
};