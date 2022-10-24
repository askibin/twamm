import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

import BlankTokenPairs from "../atoms/token-pair-cards-blank";
import Maybe, { Extra } from "../../types/maybe";
import TokenPairCards from "./token-pair-cards";
import { ConnectWalletGuard } from "./wallet-guard";
import { useTokenPairs } from "../../hooks/use-token-pairs";

export default () => {
  const tokenPairs = useTokenPairs();
  const data = Maybe.of(tokenPairs.data);

  const content = useMemo(() => {
    if (Extra.isNothing(data)) {
      return (
        <ConnectWalletGuard sx={{ p: 2 }}>
          <BlankTokenPairs />
        </ConnectWalletGuard>
      );
    }

    return <TokenPairCards data={data} />;
  }, [data]);

  return (
    <Box>
      <Typography pb={2} variant="h4">
        Top Pairs
      </Typography>
      {content}
    </Box>
  );
};
