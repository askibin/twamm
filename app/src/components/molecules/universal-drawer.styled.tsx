import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { styled } from "@mui/material/styles";

export const Drawer = styled(SwipeableDrawer)`
  padding: 0;
`;

export const Inner = styled(Box)`
  height: 100%;
  overflow: auto;
  min-width: 250px;
`;