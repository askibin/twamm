import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

import * as Styled from "./transaction-runner.styled";
import * as TxState from "../atoms/transaction-runner";
import useTxRunnerContext from "../../hooks/use-transaction-runner-context";

export interface Props {
  open: boolean;
  setOpen: (arg0: boolean) => void;
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

export default ({ open, setOpen }: Props) => {
  const { active, error, signature, viewExplorer } = useTxRunnerContext();

  const handleClose = () => setOpen(false);

  const backdropProps = useMemo(() => ({ timeout: 500 }), []);

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
    <Modal
      aria-labelledby="transaction-runner-modal-title"
      BackdropComponent={Backdrop}
      BackdropProps={backdropProps}
      closeAfterTransition
      onClose={handleClose}
      open={open}
    >
      <Fade in={open}>
        <Styled.Inner>
          <Styled.Close aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </Styled.Close>
          <Typography id="transaction-runner-modal-title" variant="h5" pb={2}>
            <Content
              hasError={state.hasError}
              isReady={state.isReady}
              isLoading={state.isLoading}
              isFinished={state.isFinished}
              signature={signature}
              viewExplorer={viewExplorer}
            />
          </Typography>
        </Styled.Inner>
      </Fade>
    </Modal>
  );
};
