import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

import * as Styled from "./transaction-runner.styled";

export interface Props {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

export default ({ open, setOpen }: Props) => {
  const handleClose = () => setOpen(false);

  const backdropProps = useMemo(() => ({ timeout: 500 }), []);

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
            Settings
          </Typography>
          <Styled.Line />
        </Styled.Inner>
      </Fade>
    </Modal>
  );
};
