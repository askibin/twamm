import Box from "@mui/material/Box";
import Maybe, { Extra } from "easy-maybe/lib";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

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

export interface Props {
  tokenPairs: Voidable<AddressPair[]>;
  tokenPair: Voidable<JupTokenData[]>;
  tradeSide: OrderType;
}

export default ({ tokenPairs, tokenPair, tradeSide }: Props) => {
  const pairs = useMemo(() => Maybe.of(tokenPairs), [tokenPairs]);
  const pair = useMemo(() => Maybe.of(tokenPair), [tokenPair]);

  const [curToken, setCurToken] = useState<number>();
  const [state, dispatch] = useReducer(availableTokens, initialState);
  const selectCoinRef = useRef<Ref>();

  {
    /*
     *const priceParams = withDefault(
     *  undefined,
     *  andMap(
     *    ([a, b]) => ({ id: a.address, vsToken: b.address }),
     *    combine2([of(state.a), of(state.b)])
     *  )
     *);
     */
  }

  // const tokenPairPrice = usePrice(priceParams);
  const selectedPair = useTokenPairByTokens(
    state.a && state.b && { aToken: state.a, bToken: state.b },
    refreshEach()
  );

  const availableMaybe = Maybe.of(state.available);

  useEffect(() => {
    if (Extra.isNothing(availableMaybe)) {
      Maybe.andMap(([p, dp]) => {
        dispatch(
          action.initWithDefault({
            pairs: p,
            pair: dp,
            type: tradeSide,
          })
        );
      }, Extra.combine2([pairs, pair]));
    }

    return () => {};
  }, [pair, availableMaybe, pairs, tradeSide]);

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
    dispatch(action.swap());
  }, []);

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

  if (Extra.isNothing(pair) || Extra.isNothing(pairs)) return <Loading />;

  return (
    <>
      <UniversalPopover ariaLabelledBy="select-coin-title" ref={selectCoinRef}>
        <CoinSelect
          id="select-coin-title"
          onDelete={onCoinDeselect}
          onSelect={onCoinSelect}
          selected={state.cancellable}
          tokens={state.available}
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
