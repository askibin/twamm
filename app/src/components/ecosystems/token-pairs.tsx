import Container from "@mui/material/Container";
import NoSsr from "@mui/material/NoSsr";
import { ErrorBoundary } from "react-error-boundary";

import ErrorFallback from "../atoms/error-fallback";
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
    <NoSsr>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <TokenPairs />
      </ErrorBoundary>
    </NoSsr>
  </Container>
);
