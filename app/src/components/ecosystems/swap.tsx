import Container from "@mui/material/Container";
import NoSsr from "@mui/material/NoSsr";
import { ErrorBoundary } from "react-error-boundary";

import * as Styled from "./swap.styled";
import ErrorFallback from "../atoms/error-fallback";
import ModeToggle from "../atoms/mode-toggle";
import TokenExchange from "../organisms/token-exchange";

export interface Props {
  mode: string;
  onModeChange: (mode: string) => void;
}

export default ({ mode, onModeChange }: Props) => (
  <Container maxWidth="sm">
    <Styled.ModeControl p={2}>
      <ModeToggle mode={mode} onChange={onModeChange} />
    </Styled.ModeControl>
    <Styled.Section>
      <NoSsr>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <TokenExchange />
        </ErrorBoundary>
      </NoSsr>
    </Styled.Section>
  </Container>
);
