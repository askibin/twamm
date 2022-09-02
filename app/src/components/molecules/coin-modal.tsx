import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import { useMemo } from "react";

import CoinSelect from "../organisms/coin-select";
import styles from "./coin-modal.module.css";

export interface Props {
  open: boolean;
  setOpen: (arg0: boolean) => void;
}

export default function ({ open, setOpen }: Props) {
  const handleClose = () => setOpen(false);

  const p2 = useMemo(() => ({ p: 2 }), []);

  return (
    <Modal
      aria-describedby="transition-modal-description"
      aria-labelledby="transition-modal-title"
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      closeAfterTransition
      onClose={handleClose}
      open={open}
    >
      <Fade in={open}>
        <Paper sx={p2} className={styles.root}>
          <IconButton
            aria-label="close"
            className={styles.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <CoinSelect />
        </Paper>
      </Fade>
    </Modal>
  );
}
