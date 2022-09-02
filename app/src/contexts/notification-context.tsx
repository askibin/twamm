import type { ReactElement } from "react";
import Fade from "@mui/material/Fade";
import { SnackbarProvider, useSnackbar } from "notistack";

export interface Props {
  maxSnack?: number;
  children: ReactElement;
}

export { useSnackbar };

export const NotificationProvider = ({ maxSnack = 1, children }: Props) => (
  <SnackbarProvider
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    autoHideDuration={3000}
    maxSnack={maxSnack}
    TransitionComponent={Fade}
  >
    {children}
  </SnackbarProvider>
);
