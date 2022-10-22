import Container from "@mui/material/Container";

import ModeToggle from "../atoms/mode-toggle";
import TokenPairs from "../organisms/token-pairs";
import * as Styled from "./token-pairs.styled";

export interface Props {
  mode: string;
  onModeChange: (mode: string) => void;
}

export default ({ mode, onModeChange }: Props) => (
  <Container>
    <Styled.ModeControl p={2}>
      <ModeToggle mode={mode} onChange={onModeChange} />
    </Styled.ModeControl>
    <TokenPairs />
  </Container>
);
