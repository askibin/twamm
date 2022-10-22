import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Maybe from "../../types/maybe";
import TokenPairCards from "./token-pair-cards";
import { useTokenPairs } from "../../hooks/use-token-pairs";

export default () => {
  const tokenPairs = useTokenPairs();

  return (
    <Box>
      <Typography pb={2} variant="h4">
        Performing Pairs
      </Typography>
      <TokenPairCards data={Maybe.of(tokenPairs.data)} />
    </Box>
  );
};
