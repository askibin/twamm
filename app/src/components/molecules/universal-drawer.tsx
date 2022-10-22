import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { useMemo } from "react";

import * as Styled from "./universal-drawer.styled";

export interface Props {
  children: ReactNode;
  open: boolean;
  setOpen: (arg0: boolean) => void;
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

export default ({ children, open, setOpen }: Props) => {
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const modalProps = useMemo(() => ({ keepMounted: true }), []);

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
      <Styled.Inner>{children}</Styled.Inner>
    </Styled.Drawer>
  );
};
