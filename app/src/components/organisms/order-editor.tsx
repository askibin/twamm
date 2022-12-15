import Box from "@mui/material/Box";
import Maybe, { Extra } from "easy-maybe/lib";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import * as Styled from "./order-editor.styled";
import availableTokens, {
  action,
  initialState,
} from "../../reducers/select-available-tokens.reducer";
import CoinSelect from "./coin-select";
import Loading from "../atoms/loading";
import PriceInfo from "./price-info";
import TokenPairForm from "../molecules/token-pair-form";
import UniversalPopover, { Ref } from "../molecules/universal-popover";
import usePrice from "../../hooks/use-price";
import useTokenPairByTokens from "../../hooks/use-token-pair-by-tokens";
import { refreshEach } from "../../swr-options";

const { andMap, of, withDefault } = Maybe;
const { combine2 } = Extra;
const M = Maybe;

export interface Props {
  a: Voidable<TokenInfo>;
  available: Voidable<TokenInfo[]>;
  b: Voidable<TokenInfo>;
  cancellable: undefined;
  onTradeChange: (arg0: {
    amount: number;
    pair: AddressPair;
    type: OrderType;
  }) => void;
  tokenPairs: Voidable<AddressPair[]>;
  tokenPair: Voidable<JupToken[]>;
  tradeSide: OrderType;
}

export default ({
  a,
  available,
  b,
  cancellable,
  onTradeChange,
  tokenPairs,
  tokenPair,
  tradeSide,
}: Props) => {
  const pairs = of(tokenPairs);
  const pair = of(tokenPair);

  const [curToken, setCurToken] = useState<number>();
  const [state, dispatch] = useReducer(availableTokens, initialState);
  const selectCoinRef = useRef<Ref>();

  const tokenPairPrice = usePrice(
    M.withDefault(
      undefined,
      M.andMap(
        ([lead, slave]) => ({ id: lead.address, vsToken: slave.address }),
        combine2([M.of(a), M.of(b)])
      )
    )
  );

  console.debug([a, b]);

  const selectedPair = useTokenPairByTokens(
    a && b && { aToken: a, bToken: b },
    refreshEach()
  );

  useEffect(() => {
    console.log("effect");

    return () => {
      if (selectedPair.data) {
        const { exchangePair } = selectedPair.data;

        // TODO: fix pair type
        const [p, t]: ExchangePair = exchangePair;

        onTradeChange({
          amount: 0,
          pair: p.map((a: JupToken) => a.address),
          type: t,
        });
      }
    };
  }, [onTradeChange, pair, pairs, selectedPair.data, tradeSide]);

  const onTokenChoose = useCallback(
    (index: number) => {
      setCurToken(index);
      if (selectCoinRef.current && !selectCoinRef.current?.isOpened)
        selectCoinRef.current.open();
    },
    [setCurToken]
  );

  const onTokenAChoose = useCallback(() => {
    onTokenChoose(1);
  }, [onTokenChoose]);

  const onTokenBChoose = useCallback(() => {
    onTokenChoose(2);
  }, [onTokenChoose]);

  const onTokenSwap = useCallback(() => {
    dispatch(action.swap({ price: tokenPairPrice.data }));
  }, [tokenPairPrice.data]);

  const onCoinDeselect = useCallback(() => {}, []);

  const onCoinSelect = useCallback(
    (token: TokenInfo) => {
      if (selectCoinRef.current?.isOpened) selectCoinRef.current.close();
      if (curToken === 1) dispatch(action.selectA({ token }));
      if (curToken === 2) dispatch(action.selectB({ token }));
    },
    [curToken]
  );

  const [exchangePair] = selectedPair.data?.exchangePair ?? [];

  if (
    Extra.isNothing(pair) ||
    Extra.isNothing(pairs) ||
    Extra.isNothing(M.of(available))
  )
    return <Loading />;

  return (
    <>
      <UniversalPopover ariaLabelledBy="select-coin-title" ref={selectCoinRef}>
        <CoinSelect
          id="select-coin-title"
          onDelete={onCoinDeselect}
          onSelect={onCoinSelect}
          selected={cancellable}
          tokens={available}
        />
      </UniversalPopover>
      <Styled.Swap elevation={1}>
        <Box p={2}>
          <TokenPairForm
            onABSwap={onTokenSwap}
            onASelect={onTokenAChoose}
            onBSelect={onTokenBChoose}
            poolCounters={selectedPair.data?.poolCounters}
            poolsCurrent={selectedPair.data?.currentPoolPresent}
            poolTifs={selectedPair.data?.tifs}
            side={state.type}
            tokenA={state.a?.symbol}
            tokenADecimals={state.a?.decimals}
            tokenB={state.b?.symbol}
            tokenPair={exchangePair}
          />
        </Box>
      </Styled.Swap>
      <Box p={2}>
        <PriceInfo
          a={state.a}
          b={state.b}
          tokenPair={selectedPair.data}
          type={state.type}
        />
      </Box>
    </>
  );
};
