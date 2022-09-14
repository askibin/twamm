import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  open: boolean;
}

const OfflineOverlay = ({ open }: Props) =>
  !open ? null : (
    <Backdrop
      sx={{
        color: "yellow",
        flexDirection: "column",
        zIndex: (theme) => theme.zIndex.tooltip + 1,
      }}
      open={open}
    >
      <Box mb="16px" role="dialog" aria-labelledby="offline">
        <CircularProgress color="inherit" />
      </Box>
      <Box>You are offline. Waiting for connection.</Box>
    </Backdrop>
  );

export default OfflineOverlay;
