import { address } from "@twamm/client.js";

import OrderEditor from "./order-editor";
import useAddressPairs from "../../hooks/use-address-pairs";
import useJupTokensByMint from "../../hooks/use-jup-tokens-by-mint";

const DEFAULT_PAIR: AddressPair = [
  address.NATIVE_TOKEN_ADDRESS,
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
];

const DEFAULT_SIDE = "buy";

export default () => {
  const tokenPairs = useAddressPairs();
  const tokenPair = useJupTokensByMint(DEFAULT_PAIR);

  return (
    <OrderEditor
      tokenPairs={tokenPairs.data}
      tokenPair={tokenPair.data}
      tradeSide={DEFAULT_SIDE}
    />
  );
};
