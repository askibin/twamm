import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import TokenPairCards from "./token-pair-cards";
import { useTokenPairs } from "../../hooks/use-token-pairs";

export default () => {
  const { data } = useTokenPairs();

  return (
    <Box>
      <Typography pb={2} variant="h4">
        Performing Pairs
      </Typography>
      <TokenPairCards data={data} />
    </Box>
  );
};
