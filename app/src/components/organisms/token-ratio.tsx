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
import Maybe, { Extra } from "../../types/maybe";
import { NativeToken } from "../../utils/twamm-client";
import TokenPairForm from "../molecules/token-pair-form";
import { useJupTokensByMint } from "../../hooks/use-jup-tokens-by-mint";
import { useTokenPair } from "../../hooks/use-token-pair";
import { refreshEach } from "../../swr-options";

export interface Props {
  pairs: TMaybe<AddressPair[]>;
}

const DEFAULT_ADDRESSES: AddressPair = [
  NativeToken.address,
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
];

export default function TokenRatio({ pairs }: Props) {
  const popoverRef = useRef<{ isOpened: boolean; open: () => void }>();
  const [curToken, setCurToken] = useState<number>();
  const [state, dispatch] = useReducer(availableTokens, initialState);

  const defaultPair = useJupTokensByMint(DEFAULT_ADDRESSES);

  // Should continiously update the pair to fetch actual data
  const selectedPair = useTokenPair(
    state.a && state.b && { aToken: state.a, bToken: state.b },
    refreshEach()
  );

  const availableMaybe = Maybe.of(state.available);
  const availableDefault = Maybe.of(defaultPair.data);

  useEffect(() => {
    if (Extra.isNothing(availableMaybe)) {
      Maybe.andMap(([p, dp]) => {
        dispatch(
          action.initWithDefault({
            pairs: p,
            // @ts-ignore
            a: dp[1],
            // @ts-ignore
            b: dp[0],
            type: "buy",
          })
        );
      }, Extra.combine2([pairs, availableDefault]));
    }

    return () => {};
  }, [availableDefault, availableMaybe, pairs]);

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
    (token: TokenInfo) => {
      if (curToken === 1) dispatch(action.selectA({ token }));
      if (curToken === 2) dispatch(action.selectB({ token }));
    },
    [curToken]
  );

  if (Extra.isNothing(availableMaybe)) {
    return <Loading />;
  }

  const [tokenPair] = selectedPair.data?.exchangePair ?? [];

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
            poolCounters={Maybe.of(selectedPair.data?.poolCounters)}
            poolsCurrent={Maybe.of(selectedPair.data?.currentPoolPresent)}
            poolTifs={Maybe.of(selectedPair.data?.tifs)}
            side={Maybe.of(state.type)}
            tokenA={state.a?.symbol}
            tokenADecimals={state.a?.decimals}
            tokenAImage={state.a?.logoURI}
            tokenB={state.b?.symbol}
            tokenBImage={state.b?.logoURI}
            tokenPair={Maybe.of(tokenPair)}
          />
        </Box>
      </Styled.Swap>
    </>
  );
}
