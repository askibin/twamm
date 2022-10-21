import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { useCallback, useMemo } from "react";

import CoinSelect from "../organisms/coin-select";
import * as Styled from "./coin-drawer.styled";

export interface Props {
  onDeselect: (arg0: string) => void;
  onSelect: (arg0: TokenInfo) => void;
  open: boolean;
  setOpen: (arg0: boolean) => void;
  tokens?: string[];
  tokensToDeselect?: string[];
}

const drawerBleeding = 56;

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor:
    theme.palette.mode === "light" ? grey[300] : theme.palette.primary.main,
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default ({
  onDeselect,
  onSelect: handleSelect,
  open,
  setOpen,
  tokens,
  tokensToDeselect,
}: Props) => {
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const modalProps = useMemo(() => ({ keepMounted: true }), []);

  const onCoinDelete = useCallback(
    (symbol: string) => {
      setOpen(false);
      onDeselect(symbol);
    },
    [onDeselect, setOpen]
  );

  const onCoinSelect = useCallback(
    (token: TokenInfo) => {
      setOpen(false);
      handleSelect(token);
    },
    [handleSelect, setOpen]
  );

  return (
    <Styled.Drawer
      anchor="bottom"
      disableSwipeToOpen={false}
      ModalProps={modalProps}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      open={open}
      swipeAreaWidth={drawerBleeding}
    >
      <Box
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
      </Box>
      <Styled.Inner>
        <CoinSelect
          tokens={tokens}
          selected={tokensToDeselect}
          onDelete={onCoinDelete}
          onSelect={onCoinSelect}
        />
      </Styled.Inner>
    </Styled.Drawer>
  );
};
