import Box from "@mui/material/Box";

import TokenRatio from "./token-ratio";
import useAddressPairs from "../../hooks/use-address-pairs";
import { ConnectWalletGuard } from "./wallet-guard";

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
