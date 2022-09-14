import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import styles from "./header.module.css";
import { useBreakpoints } from "../../hooks/use-breakpoints";

export default () => {
  const { isDesktop } = useBreakpoints();

  return (
    <AppBar aria-labelledby="header" position="static">
      <Toolbar
        className={styles.toolbar}
        variant={isDesktop ? "dense" : undefined}
      >
        <Stack direction="row" className={styles.logo}>
          <Avatar className={styles.avatar}>T</Avatar>
          Twap
        </Stack>

        <WalletMultiButton />
      </Toolbar>
    </AppBar>
  );
};
