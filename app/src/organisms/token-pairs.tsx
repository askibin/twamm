import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

import BlankTokenPairs from "../atoms/token-pair-cards-blank";
import TokenPairCards from "./token-pair-cards";
import useTokenPairs from "../hooks/use-token-pairs";
import { refreshEach } from "../swr-options";

export default () => {
  const tokenPairs = useTokenPairs(undefined, refreshEach(5 * 60000));

  const content = useMemo(() => {
    if (!tokenPairs.data) {
      return <BlankTokenPairs />;
    }

    return <TokenPairCards data={tokenPairs.data} />;
  }, [tokenPairs.data]);

  return (
    <Box pb={2}>
      <Typography pb={2} variant="h4">
        Top Pairs
      </Typography>
      {content}
    </Box>
  );
};
