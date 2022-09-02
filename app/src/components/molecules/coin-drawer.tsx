import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";

export interface Props {
  open: boolean;
  setOpen: (arg0: boolean) => void;
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

export default function ({ open, setOpen }: Props) {
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
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
          _position: "absolute",
          //top: -drawerBleeding,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          visibility: "visible",
          right: 0,
          left: 0,
        }}
      >
        <Puller />
        <Typography sx={{ p: 2, color: "text.secondary" }}>
          51 results
        </Typography>
      </StyledBox>
      <StyledBox
        sx={{
          px: 2,
          pb: 2,
          height: "100%",
          overflow: "auto",
        }}
      >
        <Skeleton variant="rectangular" height="100%" />
      </StyledBox>
    </SwipeableDrawer>
  );
}
