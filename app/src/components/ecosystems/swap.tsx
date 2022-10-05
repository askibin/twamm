import { useCallback, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import TuneIcon from "@mui/icons-material/Tune";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import ModeToggle from "../atoms/mode-toggle";
import SettingsModal from "../molecules/settings-modal";
import TokenRatio from "../organisms/token-ratio";
import * as Styled from "./swap.styled";

export interface Props {
  mode: string;
  onModeChange: (mode: string) => void;
}

export default ({ mode, onModeChange }: Props) => {
  const [opened, setOpened] = useState(false);
  const { data } = {
    data: {
      tokenA: "RAY",
      tokenB: "SOL",
      tokenAValue: 1,
      tokenBValue: 1,
    },
  };

  const onToggleSettings = useCallback(() => {
    setOpened((prev: boolean) => !prev);
  }, [setOpened]);

  const onModalClose = () => setOpened(false);

  const timeout = useMemo(() => ({ timeout: 500 }), []);

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={opened}
        onClose={onModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={timeout}
      >
        <SettingsModal open={opened} handleClose={onModalClose} />
      </Modal>
      <Container maxWidth="sm">
        <Box p={2.5} sx={{ display: "flex", justifyContent: "center" }}>
          <ModeToggle mode={mode} onChange={onModeChange} />
        </Box>
        <Styled.Section>
          <TokenRatio
            tokenA={data.tokenA}
            tokenB={data.tokenB}
            tokenAValue={data.tokenAValue}
            tokenBValue={data.tokenBValue}
          />
          <Styled.SettingsControl>
            <Styled.Control elevation={10} onClick={onToggleSettings}>
              <TuneIcon />
            </Styled.Control>
          </Styled.SettingsControl>
        </Styled.Section>
      </Container>
    </>
  );
};
