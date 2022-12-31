import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ClusterSelector from "./cluster-selector";
import ExplorerSelector from "./explorer-selector";
import SlippageSelector from "./slippage-selector";
import * as Styled from "./settings-modal.styled";

export default ({
  id,
  onToggle,
}: {
  id: string;
  onToggle: (arg0: boolean) => void;
}) => {
  const onClose = () => onToggle(false);

  return (
    <Box p={2}>
      <Typography id={id} variant="h5" pb={1}>
        Settings
      </Typography>
      <Styled.Setting direction="row" py={1}>
        <Styled.SettingLabel variant="body2">Explorer</Styled.SettingLabel>
        <ExplorerSelector onClose={onClose} />
      </Styled.Setting>
      <Styled.Setting direction="row" py={1}>
        <Styled.SettingLabel variant="body2">Slippage</Styled.SettingLabel>
        <SlippageSelector onClose={onClose} />
      </Styled.Setting>
      <Box py={2}>
        <Styled.Line />
      </Box>
      <Styled.ClusterSetting>
        <Typography variant="body2" pb={1}>
          Cluster Selector
        </Typography>
        <ClusterSelector onClose={onClose} />
      </Styled.ClusterSetting>
    </Box>
  );
};
