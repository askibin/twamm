import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

import * as TxState from "../atoms/transaction-runner";
import useTxRunner from "../../contexts/transaction-runner-context";

export interface Props {
  id: string;
}

const Content = ({
  isReady,
  isLoading,
  isFinished,
  hasError,
  signature,
  viewExplorer,
}: any) => {
  if (isLoading) return <TxState.Progress />;

  if (hasError) {
    return <TxState.Error />;
  }

  if (isFinished)
    return (
      <TxState.Success signature={signature as string} view={viewExplorer} />
    );

  if (isReady) return <TxState.Empty />;

  return <TxState.Empty />;
};

export default ({ id }: Props) => {
  const { active, error, signature, viewExplorer } = useTxRunner();

  const state = useMemo(
    () => ({
      isReady: !error && !active && !signature,
      isLoading: !error && active && !signature,
      isFinished: signature,
      hasError: error,
    }),
    [active, error, signature]
  );

  return (
    <Box p={2}>
      <Typography id={id} variant="h5" pb={2}>
        <Content
          hasError={state.hasError}
          isReady={state.isReady}
          isLoading={state.isLoading}
          isFinished={state.isFinished}
          signature={signature}
          viewExplorer={viewExplorer}
        />
      </Typography>
    </Box>
  );
};
