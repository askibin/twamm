import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import TokenPairCards from "./token-pair-cards";
import { useTokenPair } from "../../hooks/use-token-pair";

export default () => {
  const { data } = useTokenPair();

  return (
    <Box>
      <Typography pb={2} variant="h4">
        Performing Pairs
      </Typography>
      <TokenPairCards data={data} />
    </Box>
  );
};
