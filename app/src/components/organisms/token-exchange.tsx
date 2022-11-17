import Box from "@mui/material/Box";
import { address } from "@twamm/client.js";

import Loading from "../atoms/loading";
import OrderEditor from "./order-editor";
import useAddressPairs from "../../hooks/use-address-pairs";
import useJupTokensByMint from "../../hooks/use-jup-tokens-by-mint";

const DEFAULT_PAIR: AddressPair = [
  address.NATIVE_TOKEN_ADDRESS,
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
];

export default () => {
  const tokenPairs = useAddressPairs();
  const tokenPair = useJupTokensByMint(DEFAULT_PAIR);

  if (!tokenPair.data) return <Loading />;

  return (
    <Box pb={2}>
      <OrderEditor pairs={tokenPairs.data} selectedPair={tokenPair.data} />
    </Box>
  );
};
