import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import { useCallback, useMemo } from "react";

import CoinSelect from "../organisms/coin-select";
import styles from "./coin-modal.module.css";

export interface Props {
  onSelect: (arg0: string) => void;
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

export default ({ onSelect = () => {}, open, setOpen }: Props) => {
  const handleClose = () => setOpen(false);

  const p2 = useMemo(() => ({ p: 2 }), []);

  const onCoinSelect = useCallback(
    (symbol: string) => {
      setOpen(false);
      onSelect(symbol);
    },
    [onSelect, setOpen]
  );

  return (
    <Modal
      aria-describedby="transition-modal-description"
      aria-labelledby="transition-modal-title"
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      className={styles.root}
      closeAfterTransition
      onClose={handleClose}
      open={open}
    >
      <Fade in={open}>
        <Paper sx={p2} className={styles.modalInner}>
          <IconButton
            aria-label="close"
            className={styles.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <CoinSelect onSelect={onCoinSelect} />
        </Paper>
      </Fade>
    </Modal>
  );
};
