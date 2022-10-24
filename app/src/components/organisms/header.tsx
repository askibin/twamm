import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import RefreshIcon from "@mui/icons-material/Refresh";
import TuneIcon from "@mui/icons-material/Tune";
import UpdateIcon from "@mui/icons-material/Update";
import { useEffect, useMemo, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import TransactionRunnerModal from "../molecules/transaction-runner-modal";
import SettingsModal from "../molecules/settings-modal";
import * as Styled from "./header.styled";
import { useBreakpoints } from "../../hooks/use-breakpoints";
import { useSnackbar } from "../../contexts/notification-context";
import { useTxRunnerContext } from "../../hooks/use-transaction-runner-context";

export default () => {
  const { isDesktop } = useBreakpoints();
  const { active, error, signature } = useTxRunnerContext();
  const { enqueueSnackbar } = useSnackbar();

  const [txOpen, setTxOpen] = useState<boolean>(false);
  const [cfgOpen, setCfgOpen] = useState<boolean>(false);

  const txStateIcon = useMemo(() => {
    if (error) return <CancelIcon />;
    if (signature) return <DoneIcon />;
    if (active) return <RefreshIcon />;
    return <UpdateIcon />;
  }, [active, error, signature]);

  useEffect(() => {
    if (active) {
      enqueueSnackbar("Transaction is in progress...", {
        variant: "info",
        autoHideDuration: 1e3,
      });
    }
    return () => {};
  }, [active, enqueueSnackbar]);

  return (
    <>
      <TransactionRunnerModal open={txOpen} setOpen={setTxOpen} />
      <SettingsModal open={cfgOpen} setOpen={setCfgOpen} />

      <AppBar aria-labelledby="header" position="static">
        <Styled.Header variant={isDesktop ? "dense" : undefined}>
          <Styled.Logo direction="row" pr={2}>
            <Styled.Image src="/images/solana-logo.png">Solana</Styled.Image>
            TWAMM
          </Styled.Logo>

          <Styled.Controls direction="row">
            <Box px={2}>
              <Styled.UtilsControl onClick={() => setCfgOpen(true)}>
                <TuneIcon />
              </Styled.UtilsControl>
            </Box>
            <Box pr={2}>
              <Styled.UtilsControl
                istxactive={active ? "true" : "false"}
                istxerror={error ? "true" : "false"}
                istxsuccess={signature ? "true" : "false"}
                onClick={() => setTxOpen(true)}
              >
                {txStateIcon}
              </Styled.UtilsControl>
            </Box>
            <WalletMultiButton />
          </Styled.Controls>
        </Styled.Header>
      </AppBar>
    </>
  );
};
