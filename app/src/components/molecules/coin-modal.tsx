import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useCallback, useMemo } from "react";

import CoinSelect from "../organisms/coin-select";
import * as Styled from "./coin-modal.styled";

export interface Props {
  onSelect: (arg0: JupToken) => void;
  open: boolean;
  setOpen: (arg0: boolean) => void;
  tokens?: string[];
}

export default ({ onSelect = () => {}, open, setOpen, tokens }: Props) => {
  const handleClose = () => setOpen(false);

  const backdropProps = useMemo(() => ({ timeout: 500 }), []);

  const onCoinSelect = useCallback(
    (symbol: JupToken) => {
      setOpen(false);
      onSelect(symbol);
    },
    [onSelect, setOpen]
  );

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
          <CoinSelect tokens={tokens} onSelect={onCoinSelect} />
        </Styled.Inner>
      </Fade>
    </Modal>
  );
};
