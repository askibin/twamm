import Box from "@mui/material/Box";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import * as Styled from "./token-ratio.styled";
import availableTokens, {
  action,
  initialState,
} from "../../reducers/select-available-tokens.reducer";
import CoinPopover from "./coin-popover";
import Loading from "../atoms/loading";
import Maybe, { MaybeUtils } from "../../types/maybe";
import TokenPairForm from "../molecules/token-pair-form";
import { useTokenPair } from "../../hooks/use-token-pair-to-swap";

export interface Props {
  pairs: TMaybe<TokenPair[]>;
}

export default function TokenRatio({ pairs }: Props) {
  const popoverRef = useRef<{ isOpened: boolean; open: () => void }>();
  const [curToken, setCurToken] = useState<number>();
  const [state, dispatch] = useReducer(availableTokens, initialState);

  const selectedPair = useTokenPair(
    state.a && state.b && { aToken: state.a, bToken: state.b }
  );

  const availableMaybe = Maybe.of(state.available);

  useEffect(() => {
    if (MaybeUtils.isNothing(availableMaybe)) {
      Maybe.tap<TokenPair[]>((p) => dispatch(action.init({ pairs: p })), pairs);
    }

    return () => {};
  }, [availableMaybe, pairs]);

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

  const onCoinDeselect = useCallback((symbol: string) => {
    dispatch(action.clear({ symbol }));
  }, []);

  const onCoinSelect = useCallback(
    (token: JupToken) => {
      if (curToken === 1) dispatch(action.selectA({ token }));
      if (curToken === 2) dispatch(action.selectB({ token }));
    },
    [curToken]
  );

  if (MaybeUtils.isNothing(availableMaybe))
    return MaybeUtils.nothing(Loading, availableMaybe);

  const [tokenPair, orderType] = selectedPair.data?.exchangePair ?? [];

  return (
    <>
      <CoinPopover
        onDeselect={onCoinDeselect}
        onChange={onCoinSelect}
        ref={popoverRef}
        tokens={state.available}
        tokensToDeselect={state.cancellable}
      />
      <Styled.Swap elevation={1}>
        <Box p={2}>
          <TokenPairForm
            onABSwap={onTokenSwap}
            onASelect={onTokenAChoose}
            onBSelect={onTokenBChoose}
            orderType={Maybe.of(orderType)}
            poolCounters={Maybe.of(selectedPair.data?.poolCounters)}
            poolsCurrent={Maybe.of(selectedPair.data?.currentPoolPresent)}
            poolTifs={Maybe.of(selectedPair.data?.tifs)}
            side={Maybe.of(state.type)}
            tokenA={state.a?.symbol}
            tokenADecimals={state.a?.decimals}
            tokenAImage={state.a?.logoURI}
            tokenAMint={state.a?.address}
            tokenB={state.b?.symbol}
            tokenBImage={state.b?.logoURI}
            tokenBMint={state.b?.address}
            tokenPair={Maybe.of(tokenPair)}
          />
        </Box>
      </Styled.Swap>
    </>
  );
}
