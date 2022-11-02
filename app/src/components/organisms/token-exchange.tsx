import Box from "@mui/material/Box";

import TokenRatio from "./token-ratio";
import { ConnectWalletGuard } from "./wallet-guard";
import { useAddressPairs } from "../../hooks/use-address-pairs";

export default () => {
  const tokenPairs = useAddressPairs();

  return (
    <>
      <Box pb={2}>
        <TokenRatio pairs={tokenPairs.data} />
      </Box>
      {!tokenPairs.data && <ConnectWalletGuard sx={{ py: 2 }} />}
    </>
  );
};
