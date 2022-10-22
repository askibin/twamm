import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";

import * as Styled from "./swap.styled";
import Maybe from "../../types/maybe";
import ModeToggle from "../atoms/mode-toggle";
import TokenRatio from "../organisms/token-ratio";
import { useAddressPairs } from "../../hooks/use-address-pairs";

export interface Props {
  mode: string;
  onModeChange: (mode: string) => void;
}

export default ({ mode, onModeChange }: Props) => {
  const tokenPairs = useAddressPairs();

  return (
    <Container maxWidth="sm">
      <Styled.ModeControl p={2}>
        <ModeToggle mode={mode} onChange={onModeChange} />
      </Styled.ModeControl>
      <Styled.Section>
        {tokenPairs.error && (
          <Alert severity="error">{tokenPairs.error.message}</Alert>
        )}
        <TokenRatio pairs={Maybe.of(tokenPairs.data)} />
      </Styled.Section>
    </Container>
  );
};
