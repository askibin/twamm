import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { forwardRef } from "react";

import ClusterSelector from "./cluster-selector";
import * as Styled from "./settings-modal.styled";

export interface Props {
  open: boolean;
  handleClose: () => void;
}

export default forwardRef(({ open, handleClose }: Props, ref) => (
  <Fade in={open} ref={ref}>
    <Styled.Modal>
      <Typography variant="h5" pb={2}>
        Settings
      </Typography>
      <Styled.Line />
      <Typography variant="h6" p={2}>
        Cluster Selector
      </Typography>
      <ClusterSelector handleClose={handleClose} />
    </Styled.Modal>
  </Fade>
));
