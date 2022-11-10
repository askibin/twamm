import Box from "@mui/material/Box";
import Maybe, { Extra } from "easy-maybe/lib";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import * as Styled from "./token-ratio.styled";
import availableTokens, {
  action,
  initialState,
} from "../../reducers/select-available-tokens.reducer";
import CoinPopover from "./coin-popover";
import TokenPairForm from "../molecules/token-pair-form";
import useTokenPair from "../../hooks/use-token-pair";
import { refreshEach } from "../../swr-options";

export interface Props {
  pairs: Voidable<AddressPair[]>;
  selectedPair: Voidable<JupTokenData[]>;
}

export default ({ pairs: tokenPairs, selectedPair: defaultPair }: Props) => {
  const pairs = Maybe.of(tokenPairs);
  const pair = Maybe.of(defaultPair);

  const popoverRef = useRef<{ isOpened: boolean; open: () => void }>();
  const [curToken, setCurToken] = useState<number>();
  const [state, dispatch] = useReducer(availableTokens, initialState);

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
      if (!popoverRef.current?.isOpened) popoverRef.current?.open();
    },
    [popoverRef, setCurToken]
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
      if (curToken === 1) dispatch(action.selectA({ token }));
      if (curToken === 2) dispatch(action.selectB({ token }));
    },
    [curToken]
  );

  const [tokenPair] = selectedPair.data?.exchangePair ?? [];

  return (
    <>
      <CoinPopover
        onDeselect={onCoinDeselect}
        onChange={onCoinSelect}
        ref={popoverRef}
        tokens={curToken === 2 ? state.available : state.all}
        tokensToDeselect={state.cancellable}
      />
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
