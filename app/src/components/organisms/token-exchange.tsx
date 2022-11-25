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

  return (
    <OrderEditor
      onTradeChange={props.onTradeChange}
      tokenPairs={tokenPairs.data}
      tokenPair={tokenPair.data}
      trade={props.trade}
      tradeSide={props.trade.type}
    />
  );
};
