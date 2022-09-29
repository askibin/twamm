import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import ModeToggle from "../atoms/mode-toggle";
import TokenPairs from "../organisms/token-pairs";

export interface Props {
  mode: string;
  onModeChange: (mode: string) => void;
}

export default ({ mode, onModeChange }: Props) => (
  <Container>
    <Box p={2.5} sx={{ display: "flex", justifyContent: "center" }}>
      <ModeToggle mode={mode} onChange={onModeChange} />
    </Box>
    <TokenPairs />
  </Container>
);
