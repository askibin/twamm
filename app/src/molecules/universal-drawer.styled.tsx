import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { styled } from "@mui/material/styles";

export const Drawer = styled(SwipeableDrawer)`
  & .MuiDrawer-paper {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 0;
    visibility: visible;
  }
`;

export const Inner = styled(Box)`
  height: 100%;
  min-width: 250px;
  overflow: auto;
  padding-bottom: ${(p) => p.theme.spacing(2)};
`;
