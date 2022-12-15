import { useCallback, useEffect } from "react";
import M, { Extra } from "easy-maybe/lib";
import * as R from "../../reducers/select-available-tokens.reducer";
import OrderEditor from "./order-editor";
import useAddressPairs from "../../hooks/use-address-pairs";
import useJupTokensByMint from "../../hooks/use-jup-tokens-by-mint";
import useTokenExchange from "../../hooks/use-token-exchange";
import { OrderSides } from "../../types/enums.d";

export type TradeStruct = {
  amount: number;
  pair: AddressPair;
  type: OrderSides;
};

export interface Props {
  onTradeChange: (arg0: TradeStruct) => void;
  trade: TradeStruct;
}

export default (props: Props) => {
  const tokenPairs = useAddressPairs();
  const tokenPair = useJupTokensByMint(props.trade.pair);

  const [state, dispatch] = useTokenExchange();

  console.log({ state: state.data });

  useEffect(() => {
    M.andMap(([pairs, pair, type]) => {
      console.info("INIT");

      dispatch(R.action.init({ pairs, pair, type }));
    }, Extra.combine3([M.of(tokenPairs.data), M.of(tokenPair.data), M.of(props.trade.type)]));

    return () => {};
  }, [dispatch, props.trade, tokenPairs.data, tokenPair.data]);

  const onTradeChange = useCallback(
    (next: TradeStruct) => {
      const prev = props.trade;

      console.log("trd", prev, next);

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
      a={state.data?.a}
      available={state.data?.available}
      b={state.data?.b}
      cancellable={undefined}
      onTradeChange={onTradeChange}
      tokenPair={tokenPair.data}
      tokenPairs={tokenPairs.data}
      tradeSide={props.trade.type}
    />
  );
};
