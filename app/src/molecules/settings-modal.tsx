import type { MouseEvent } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";

import * as Styled from "./settings-modal.styled";
import ClusterSelector from "./cluster-selector";
import ExplorerSelector from "./explorer-selector";
import i18n from "../i18n";
import PerformanceFeeSelector from "./performance-fee-selector";
import SlippageSelector from "./slippage-selector";
import useTxRunner from "../contexts/transaction-runner-context";
import ToggleOption from "./toggle-option";

const jupVersionedInfo =
  "Enable Jupiter's Versioned API for instant exchange. Phantom, Solflare, Glow and Backpack wallets are supported. Please turn this setting off unless using one of the listed wallets."; // eslint-disable-line max-len

export default ({
  id,
  onToggle,
}: {
  id: string;
  onToggle: (arg0: boolean) => void;
}) => {
  const { performanceFee } = useTxRunner();

  const onClose = () => onToggle(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (anchorEl) {
        setAnchorEl(null);
      } else {
        setAnchorEl(event.currentTarget);
      }
    },
    [anchorEl, setAnchorEl]
  );

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box p={2}>
      <Typography id={id} variant="h5" pb={1}>
        {i18n.Settings}
      </Typography>
      <Styled.Setting direction="row" py={1}>
        <Styled.SettingLabel variant="body2">
          {i18n.SettingsSettingExplorer}
        </Styled.SettingLabel>
        <ExplorerSelector onClose={onClose} />
      </Styled.Setting>
      <Styled.Setting direction="row" py={1}>
        <Styled.SettingLabel variant="body2">
          {i18n.SettingsSettingSlippage}
        </Styled.SettingLabel>
        <SlippageSelector onClose={onClose} />
      </Styled.Setting>
      <Styled.Setting direction="row" py={1}>
        <Box>
          <Styled.SettingLabel variant="body2">
            {i18n.SettingsSettingPerformaceFee}
          </Styled.SettingLabel>
          {performanceFee > 0 && (
            <Typography color="text.secondary" variant="body2">
              {i18n.SettingsSettingPerformanceFeeValuePre} {performanceFee}
              {i18n.SettingsSettingPerformanceFeeValuePost}
            </Typography>
          )}
        </Box>
        <PerformanceFeeSelector />
      </Styled.Setting>

      <Styled.Setting justifyContent="space-between" direction="row" py={1}>
        <Stack direction="row">
          <Styled.SettingLabel color="text.secondary" pr={1} variant="body2">
            {i18n.SettingsSettingVersionedTx}
          </Styled.SettingLabel>
          <IconButton
            sx={{ padding: 0 }}
            color="warning"
            onClick={handlePopoverOpen}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Stack>
        <ToggleOption onClose={onClose} />
      </Styled.Setting>

      <Box py={2}>
        <Styled.Line />
      </Box>
      <Styled.ClusterSetting>
        <Typography variant="body2" pb={1}>
          {i18n.SettingsSettingClusterSelector}
        </Typography>
        <ClusterSelector onClose={onClose} />
      </Styled.ClusterSetting>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        sx={{
          pointerEvents: "none",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography
          sx={{ padding: 2, maxWidth: 300 }}
          variant="body2"
          onClick={handlePopoverClose}
        >
          {i18n.SettingsSettingVersionedTxInfo}
        </Typography>
      </Popover>
    </Box>
  );
};
