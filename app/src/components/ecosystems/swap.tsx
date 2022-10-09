import Box from "@mui/material/Box";
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

  const { data } = {
    data: {
      tokenA: "RAY",
      tokenB: "SOL",
      tokenAValue: 1,
      tokenBValue: 1,
    },
  };

  return (
    <Container maxWidth="sm">
      <Box p={2.5} sx={{ display: "flex", justifyContent: "center" }}>
        <ModeToggle mode={mode} onChange={onModeChange} />
      </Box>
      <Styled.Section>
        <TokenRatio
          pairs={Maybe.of(tokenPairs.data)}
          tokenA={data.tokenA}
          tokenB={data.tokenB}
          tokenAValue={data.tokenAValue}
          tokenBValue={data.tokenBValue}
        />
      </Styled.Section>
    </Container>
  );
};
