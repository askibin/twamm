import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import ModeToggle from "../atoms/mode-toggle";
import TokenRatio from "../organisms/token-ratio";

export interface Props {
  mode: string;
  onModeChange: (mode: string) => void;
}

export default ({ mode, onModeChange }: Props) => {
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
      <TokenRatio
        tokenA={data.tokenA}
        tokenB={data.tokenB}
        tokenAValue={data.tokenAValue}
        tokenBValue={data.tokenBValue}
      />
    </Container>
  );
};
