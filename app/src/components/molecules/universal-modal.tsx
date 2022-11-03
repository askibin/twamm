import type { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useCallback, useMemo } from "react";

import * as Styled from "./universal-modal.styled";

export interface Props {
  children: ReactNode;
  onClose?: () => void;
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

export default ({ children, onClose, open, setOpen }: Props) => {
  const handleClose = useCallback(() => {
    setOpen(false);
    if (onClose) onClose();
  }, [onClose, setOpen]);

  const backdropProps = useMemo(() => ({ timeout: 500 }), []);

  return (
    <Modal
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
          {children}
        </Styled.Inner>
      </Fade>
    </Modal>
  );
};
