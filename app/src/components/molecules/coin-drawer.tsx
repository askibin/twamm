import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { useCallback } from "react";

import CoinSelect from "../organisms/coin-select";
import styles from "./coin-drawer.module.css";

export interface Props {
  onSelect: (arg0: string) => void;
  open: boolean;
  setOpen: (arg0: boolean) => void;
  tokens?: string[];
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const drawerBleeding = 56;

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default ({
  onSelect: handleSelect = () => {},
  open,
  setOpen,
  tokens,
}: Props) => {
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const onSelect = useCallback(
    (symbol: string) => {
      setOpen(false);
      handleSelect(symbol);
    },
    [handleSelect, setOpen]
  );

  return (
    <SwipeableDrawer
      anchor="bottom"
      className={styles.root}
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      swipeAreaWidth={drawerBleeding}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <StyledBox
        sx={{
          top: -drawerBleeding,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          visibility: "visible",
          right: 0,
          left: 0,
          p: 0,
        }}
      >
        <Puller />
      </StyledBox>
      <StyledBox
        className={styles.inner}
        sx={{
          height: "100%",
          overflow: "auto",
        }}
      >
        <CoinSelect tokens={tokens} onSelect={onSelect} />
      </StyledBox>
    </SwipeableDrawer>
  );
};
