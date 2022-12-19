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

  useEffect(() => {
    M.andMap(([pairs, pair, type]) => {
      dispatch(R.action.init({ pairs, pair, type }));
    }, Extra.combine3([M.of(tokenPairs.data), M.of(tokenPair.data), M.of(props.trade.type)]));

    return () => {};
  }, [dispatch, props.trade, tokenPairs.data, tokenPair.data]);

  const onSelectA = useCallback(
    (token: CoinToken) => {
      dispatch(R.action.selectA({ token }));
    },
    [dispatch]
  );

  const onSelectB = useCallback(
    (token: CoinToken) => {
      dispatch(R.action.selectB({ token }));
    },
    [dispatch]
  );

  const onSwap = useCallback(
    (price: number | undefined) => {
      dispatch(R.action.swap({ price }));
    },
    [dispatch]
  );

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
      a={state.data?.a}
      all={state.data?.all}
      available={state.data?.available}
      b={state.data?.b}
      cancellable={undefined}
      onSelectA={onSelectA}
      onSelectB={onSelectB}
      onSwap={onSwap}
      onTradeChange={onTradeChange}
      tokenPair={tokenPair.data}
      tokenPairs={tokenPairs.data}
      tradeSide={state.data?.type}
    />
  );
};
