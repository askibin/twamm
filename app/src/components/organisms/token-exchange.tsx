import Box from "@mui/material/Box";

import Loading from "../atoms/loading";
import TokenRatio from "./token-ratio";
import useAddressPairs from "../../hooks/use-address-pairs";
import useJupTokensByMint from "../../hooks/use-jup-tokens-by-mint";
import { NativeToken } from "../../utils/twamm-client";

const DEFAULT_PAIR: AddressPair = [
  NativeToken.address,
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
];

export default () => {
  const tokenPairs = useAddressPairs();
  const tokenPair = useJupTokensByMint(DEFAULT_PAIR);

  if (!tokenPair.data) return <Loading />;

  return (
    <Box pb={2}>
      <TokenRatio pairs={tokenPairs.data} selectedPair={tokenPair.data} />
    </Box>
  );
};
