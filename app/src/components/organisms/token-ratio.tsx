import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import type { Maybe } from "../../types/maybe.d";
import * as Styled from "./token-ratio.styled";
import availableTokens, {
  action,
  initialState,
} from "../../reducers/select-available-tokens.reducer";
import CoinPopover from "./coin-popover";
import Mby, { MaybeUtils } from "../../types/maybe";
import TokenPairForm from "../molecules/token-pair-form";
import { useTokenPair } from "../../hooks/use-token-pair-to-swap";

export interface Props {
  pairs: Maybe<TokenPair[]>;
}

export default function TokenRatio({ pairs }: Props) {
  const popoverRef = useRef<{ isOpened: boolean; open: () => void }>();
  const [curToken, setCurToken] = useState<number>();
  const [state, dispatch] = useReducer(availableTokens, initialState);

  const selectedPair = useTokenPair(
    state.a && state.b && { aToken: state.a, bToken: state.b }
  );

  const availableMaybe = Mby.of(state.available);

  useEffect(() => {
    if (!state.available) {
      Mby.tap<TokenPair[]>((p) => dispatch(action.init({ pairs: p })), pairs);
    }

    return () => {};
  }, [pairs, state.available]);

  const onTokenAChoose = useCallback(() => {
    setCurToken(1);
    if (!popoverRef.current?.isOpened) popoverRef.current?.open();
  }, [popoverRef, setCurToken]);

  const onTokenBChoose = useCallback(() => {
    setCurToken(2);
    if (!popoverRef.current?.isOpened) popoverRef.current?.open();
  }, [popoverRef, setCurToken]);

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

  if (MaybeUtils.isNothing(availableMaybe)) {
    return Mby.nothing(
      () => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ),
      availableMaybe
    );
  }
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
            onASelect={onTokenAChoose}
            onBSelect={onTokenBChoose}
            tokenA={state.a?.symbol}
            tokenAImage={state.a?.logoURI}
            tokenAMint={state.a?.address}
            tokenB={state.b?.symbol}
            tokenBImage={state.b?.logoURI}
            tokenBMint={state.b?.address}
            tokenPair={selectedPair}
          />
        </Box>
      </Styled.Swap>
    </>
  );
}
