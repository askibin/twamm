import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ClusterSelector from "./cluster-selector";
import ExplorerSelector from "./explorer-selector";
import * as Styled from "./settings-modal.styled";

export interface Props {
  id: string;
}

export default ({ id }: Props) => (
  <Box p={2}>
    <Typography id={id} variant="h5" pb={2}>
      Settings
    </Typography>
    <Styled.Setting direction="row" py={3}>
      <Styled.SettingLabel variant="body2">Explorer</Styled.SettingLabel>
      <ExplorerSelector />
    </Styled.Setting>
    <Styled.Line />
    <Styled.ClusterSetting py={3}>
      <Typography variant="body2">Cluster Selector</Typography>
      <ClusterSelector />
    </Styled.ClusterSetting>
  </Box>
);
