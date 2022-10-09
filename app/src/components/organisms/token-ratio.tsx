import type { SWRResponse } from "swr";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { flatten } from "ramda";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import type { Maybe } from "../../types/maybe.d";
import Mby from "../../types/maybe";
import * as Styled from "./token-ratio.styled";
import CoinPopover from "./coin-popover";
import TokenPairForm from "../molecules/token-pair-form";
import availableTokens, {
  action,
  initialState,
} from "../../reducers/select-available-tokens.reducer";
import { useTokenPair } from "../../hooks/use-token-pair-to-swap";

export interface Props {
  // pairs: SWRResponse<Array<[string, string]>>;
  pairs: Maybe<TokenPair[]>;
}

export default function TokenRatio({ pairs }: Props) {
  const popoverRef = useRef<{ isOpened: boolean; open: () => void }>();

  console.log(pairs);

  const [curToken, setCurToken] = useState<number>();
  const [aToken, setAToken] = useState<JupToken>();
  const [bToken, setBToken] = useState<JupToken>();

  const [state, dispatch] = useReducer(availableTokens, initialState);

  const selectedPair = useTokenPair(aToken && bToken && { aToken, bToken });

  useEffect(() => {
    if (!state.available) {
      Mby.tap<TokenPair[]>((p) => dispatch(action.init({ pairs: p })), pairs);
    }

    return () => {};
  }, [pairs, state.available]);

  const onTokenAChoose = useCallback(() => {
    setCurToken(1);
    if (!popoverRef.current?.isOpened) popoverRef.current?.open();
  }, [popoverRef, setCurToken, state.a]);

  const onTokenBChoose = useCallback(() => {
    setCurToken(2);
    if (!popoverRef.current?.isOpened) popoverRef.current?.open();
  }, [popoverRef, setCurToken]);

  const onCoinDeselect = useCallback((symbol) => {
    console.log(symbol);
    dispatch(action.clear({ symbol }));
  }, []);

  const onCoinSelect = useCallback(
    (token: JupToken) => {
      console.log({ token });
      if (curToken === 1) {
        dispatch(action.selectA({ token }));
      }
      if (curToken === 1) setAToken(token);
      if (curToken === 2) setBToken(token);
    },
    [curToken]
  );

  const availableTokens1 = useMemo(() => {
    if (!state.available) return undefined;

    return Array.from(new Set(flatten(state.available)).values());
  }, [/*pairs.data*/ state.available]);

  console.log({ availableTokens1 }, state);

  if (!state.available && !pairs.error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
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
            tokenB={bToken?.symbol}
            tokenBImage={bToken?.logoURI}
            tokenBMint={bToken?.address}
            tokenPair={selectedPair}
          />
        </Box>
      </Styled.Swap>
    </>
  );
}
