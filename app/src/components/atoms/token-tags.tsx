import type { MouseEvent } from "react";
import Avatar from "@mui/material/Avatar";

import * as Styled from "./token-tags.styled";

export interface Props {
  coins: Array<{ symbol: string; image: string; name: string }>;
  onClick: (arg0: MouseEvent, arg1: string) => void;
}

export default ({ coins, onClick = () => {} }: Props) => (
  <Styled.Tags direction="row" mt={2}>
    {coins.map(({ image, name, symbol }) => (
      <Styled.Tag
        avatar={<Avatar alt={name} src={image} />}
        key={symbol}
        label={symbol.toUpperCase()}
        onClick={(e: MouseEvent) => onClick(e, symbol)}
        sx={{ mr: 1, mb: 1 }}
        variant="outlined"
      />
    ))}
  </Styled.Tags>
);
