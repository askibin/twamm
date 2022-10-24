import Box from "@mui/material/Box";

import Maybe, { Extra } from "../../types/maybe";
import TokenRatio from "./token-ratio";
import { ConnectWalletGuard } from "./wallet-guard";
import { useAddressPairs } from "../../hooks/use-address-pairs";

export default () => {
  const tokenPairs = useAddressPairs();
  const data = Maybe.of(tokenPairs.data);

  return (
    <>
      <Box pb={2}>
        <TokenRatio pairs={data} />
      </Box>
      {Extra.isNothing(data) && <ConnectWalletGuard sx={{ py: 2 }} />}
    </>
  );
};
