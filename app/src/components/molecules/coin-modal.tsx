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
  tokensToDeselect?: string[];
}

export default ({
  onDeselect,
  onSelect,
  open,
  setOpen,
  tokens,
  tokensToDeselect,
}: Props) => {
  const handleClose = () => setOpen(false);

  const backdropProps = useMemo(() => ({ timeout: 500 }), []);

  const onCoinDelete = useCallback(
    (symbol: string) => {
      setOpen(false);
      onDeselect(symbol.toLowerCase());
    },
    [onDeselect, setOpen]
  );

  const onCoinSelect = useCallback(
    (token: JupToken) => {
      setOpen(false);
      onSelect(token);
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
          <CoinSelect
            tokens={tokens}
            selected={tokensToDeselect}
            onDelete={onCoinDelete}
            onSelect={onCoinSelect}
          />
        </Styled.Inner>
      </Fade>
    </Modal>
  );
};
