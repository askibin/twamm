import { useCallback } from "react";
import OrderEditor from "./order-editor";
import useAddressPairs from "../../hooks/use-address-pairs";
import useJupTokensByMint from "../../hooks/use-jup-tokens-by-mint";

export type TradeStruct = {
  amount: number;
  pair: AddressPair;
  type: OrderType;
};

export interface Props {
  onTradeChange: (arg0: TradeStruct) => void;
  trade: TradeStruct;
}

export default (props: Props) => {
  const tokenPairs = useAddressPairs();
  const tokenPair = useJupTokensByMint(props.trade.pair);

  const onTradeChange = useCallback(
    (next: TradeStruct) => {
      const prev = props.trade;
      if (
        prev.pair[0] !== next.pair[0] ||
        prev.pair[1] !== next.pair[1] ||
        prev.type !== next.type
      ) {
        props.onTradeChange(next);
      }
    },
    [props]
  );

  return (
    <OrderEditor
      onTradeChange={onTradeChange}
      tokenPairs={tokenPairs.data}
      tokenPair={tokenPair.data}
      tradeSide={props.trade.type}
    />
  );
};
