import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import TuneIcon from "@mui/icons-material/Tune";
import { useCallback, useRef } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import * as Styled from "./header.styled";
import SettingsModal from "../molecules/settings-modal";
import TransactionRunnerModal from "../molecules/transaction-runner-modal";
import TransactionProgress from "./transaction-progress";
import UniversalPopover, { Ref } from "../molecules/universal-popover";
import useBreakpoints from "../../hooks/use-breakpoints";

export default () => {
  const { isDesktop, isMobile } = useBreakpoints();

  const runnerRef = useRef<Ref>();
  const settingsRef = useRef<Ref>();

  const onSettingsToggle = useCallback((flag: boolean) => {
    if (flag) settingsRef.current?.open();
    else settingsRef.current?.close();
  }, []);

  const onTxStatusToggle = useCallback((flag: boolean) => {
    if (flag) runnerRef.current?.open();
    else runnerRef.current?.close();
  }, []);

  return (
    <>
      <UniversalPopover ariaLabelledBy="tx-runner-modal-title" ref={runnerRef}>
        <TransactionRunnerModal id="tx-runner-modal-title" />
      </UniversalPopover>

      <UniversalPopover ariaLabelledBy="settings-modal-title" ref={settingsRef}>
        <SettingsModal id="settings-modal-title" />
      </UniversalPopover>

      <AppBar aria-labelledby="header" position="sticky">
        <Styled.Header variant={isDesktop ? "dense" : undefined}>
          <Styled.Logo direction="row" pr={2}>
            <Styled.Image src="/images/solana-logo.png">Solana</Styled.Image>
            {isMobile ? null : "TWAMM"}
          </Styled.Logo>

          <Styled.Controls direction="row">
            <Box px={2}>
              <Styled.UtilsControl onClick={() => onSettingsToggle(true)}>
                <TuneIcon />
              </Styled.UtilsControl>
            </Box>
            <Box pr={2}>
              <TransactionProgress setOpen={() => onTxStatusToggle(true)} />
            </Box>
            <Box py={isDesktop ? 1 : 0}>
              <WalletMultiButton />
            </Box>
          </Styled.Controls>
        </Styled.Header>
      </AppBar>
    </>
  );
};
