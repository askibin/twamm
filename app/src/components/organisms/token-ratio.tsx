import Box from "@mui/material/Box";
import Maybe, { Extra } from "easy-maybe/lib";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import * as Styled from "./token-ratio.styled";
import availableTokens, {
  action,
  initialState,
} from "../../reducers/select-available-tokens.reducer";
import CoinSelect from "./coin-select";
import TokenPairForm from "../molecules/token-pair-form";
import UniversalPopover, { Ref } from "../molecules/universal-popover";
import useJupTokensByMint from "../../hooks/use-jup-tokens-by-mint";
import useTokenPair from "../../hooks/use-token-pair";
import { refreshEach } from "../../swr-options";

export interface Props {
  pairs: Voidable<AddressPair[]>;
  selectedPair: Voidable<JupTokenData[]>;
}

export default ({ pairs: tokenPairs, selectedPair: defaultPair }: Props) => {
  const pairs = Maybe.of(tokenPairs);
  const pair = Maybe.of(defaultPair);

  const [curToken, setCurToken] = useState<number>();
  const [state, dispatch] = useReducer(availableTokens, initialState);
  const selectCoinRef = useRef<Ref>();

  const selectedPair = useTokenPair(
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
            type: "buy",
          })
        );
      }, Extra.combine2([pairs, pair]));
    }

    return () => {};
  }, [pair, availableMaybe, pairs]);

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

  const onTokenSwap = () => {
    dispatch(action.swap());
  };

  const onCoinDeselect = useCallback(() => {}, []);

  const onCoinSelect = useCallback(
    (token: TokenInfo) => {
      if (selectCoinRef.current?.isOpened) selectCoinRef.current.close();
      if (curToken === 1) dispatch(action.selectA({ token }));
      if (curToken === 2) dispatch(action.selectB({ token }));
    },
    [curToken]
  );

  const [tokenPair] = selectedPair.data?.exchangePair ?? [];

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
            tokenPair={tokenPair}
          />
        </Box>
      </Styled.Swap>
    </>
  );
};
