import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import Link from "@mui/material/Link";
import RefreshIcon from "@mui/icons-material/Refresh";
import Typography from "@mui/material/Typography";

import * as Styled from "./transaction-runner.styled";

export const Empty = () => (
  <Styled.Container p={2}>
    <Box pb={2}>
      <Styled.IdleIcon>
        <HourglassEmptyIcon />
      </Styled.IdleIcon>
    </Box>
    <Box pb={1}>
      <Styled.RunnerTitle variant="h5">Idle</Styled.RunnerTitle>
    </Box>
    <Typography textAlign="center" variant="body1">
      No active transaction.
    </Typography>
  </Styled.Container>
);

export const Progress = () => (
  <Styled.Container p={2}>
    <Box pb={2}>
      <Styled.RefreshIcon>
        <RefreshIcon />
      </Styled.RefreshIcon>
    </Box>
    <Box pb={1}>
      <Styled.RunnerTitle variant="h5">Working</Styled.RunnerTitle>
    </Box>
    <Typography textAlign="center" variant="body1">
      Crunching current transaction
    </Typography>
  </Styled.Container>
);

export const Success = ({
  signature,
  view,
}: {
  signature: string;
  view: (arg0: string) => string;
}) => (
  <Styled.Container p={2}>
    <Box pb={2}>
      <Styled.SuccessIcon>
        <CheckCircleIcon />
      </Styled.SuccessIcon>
    </Box>
    <Box pb={1}>
      <Styled.RunnerTitle variant="h5">Done!</Styled.RunnerTitle>
    </Box>
    <Typography textAlign="center" variant="body1">
      You transaction was validated.
    </Typography>
    <Typography textAlign="center" variant="body1">
      <Link rel="noopener" target="_blank" href={view(signature)}>
        See details here
      </Link>
    </Typography>
  </Styled.Container>
);

export const Error = () => (
  <Styled.Container p={2}>
    <Box pb={2}>
      <Styled.ErrorIcon>
        <CloseIcon />
      </Styled.ErrorIcon>
    </Box>
    <Box pb={1}>
      <Styled.RunnerTitle variant="h5">Error!</Styled.RunnerTitle>
    </Box>
    <Typography textAlign="center" variant="body1">
      Can not finish the operation.
    </Typography>
  </Styled.Container>
);
