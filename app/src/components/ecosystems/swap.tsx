import Container from "@mui/material/Container";

import ModeToggle from "../atoms/mode-toggle";
import TokenRatio from "../organisms/token-ratio";
import Maybe from "../../types/maybe";
import * as Styled from "./swap.styled";
import { useTokenPairsToSwap } from "../../hooks/use-token-pairs-to-swap";

export interface Props {
  mode: string;
  onModeChange: (mode: string) => void;
}

export default ({ mode, onModeChange }: Props) => {
  const tokenPairs = useTokenPairsToSwap();

  return (
    <Container maxWidth="sm">
      <Styled.ModeControl p={2}>
        <ModeToggle mode={mode} onChange={onModeChange} />
      </Styled.ModeControl>
      <Styled.Section>
        <TokenRatio pairs={Maybe.of(tokenPairs.data)} />
      </Styled.Section>
    </Container>
  );
};
