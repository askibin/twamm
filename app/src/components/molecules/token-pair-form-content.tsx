import Box from "@mui/material/Box";
import Maybe, { Extra } from "easy-maybe/lib";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { useEffect, useMemo, useReducer } from "react";

import type { SelectedTif } from "./trade-intervals";
import * as Styled from "./token-pair-form-content.styled";
import ConnectButton from "../atoms/token-pair-form-content-button";
import InTokenField from "./in-token-field";
import TokenSelect from "../atoms/token-select";
import TradeIntervals from "./trade-intervals";
import tradeTokenPair, {
  action,
  initialState,
} from "../../reducers/trade-token-pair.reducer";

export interface Props {
  handleSubmit: () => void;
  intervalTifs?: { tif: any; index: any; left: any }[];
  isScheduled?: boolean;
  onABSwap: () => void;
  onASelect: () => void;
  onBSelect: () => void;
  onChangeAmount: (arg0: number) => void;
  onIntervalSelect: (tif: SelectedTif) => void;
  submitting: boolean;
  tif?: SelectedTif;
  tokenPair: Voidable<TokenPair<JupToken>>;
  tradeSide: Voidable<OrderType>;
  valid: boolean;
}

export default ({
  handleSubmit,
  intervalTifs,
  isScheduled,
  onABSwap,
  onASelect,
  onBSelect,
  onChangeAmount,
  onIntervalSelect,
  submitting,
  tif,
  tokenPair,
  tradeSide,
  valid,
}: Props) => {
  const [state, dispatch] = useReducer(tradeTokenPair, initialState);

  const pair = useMemo(() => Maybe.of(tokenPair), [tokenPair]);
  const side = useMemo(() => Maybe.of(tradeSide), [tradeSide]);

  useEffect(() => {
    Maybe.andMap(([a, b]) => {
      dispatch(action.setPair({ pair: a, side: b }));
    }, Extra.combine2([pair, side]));

    return () => {};
  }, [pair, side]);

  return (
    <form onSubmit={handleSubmit}>
      <Styled.TokenLabelBox>You pay</Styled.TokenLabelBox>
      <InTokenField
        address={state.a?.address}
        name={state.a?.symbol}
        onChange={onChangeAmount}
        onSelect={onASelect}
        src={state.a?.logoURI}
      />
      <Styled.OperationImage>
        <Styled.OperationButton
          disabled={!state.a || !state.b}
          onClick={onABSwap}
        >
          <SyncAltIcon />
        </Styled.OperationButton>
      </Styled.OperationImage>
      <Styled.TokenLabelBox>You receive</Styled.TokenLabelBox>
      <Box pb={2}>
        <TokenSelect
          alt={state.b?.symbol}
          disabled={!state.a}
          image={state.b?.logoURI}
          label={state.b?.symbol}
          onClick={onBSelect}
        />
      </Box>
      <Box py={2}>
        <TradeIntervals
          indexedTifs={intervalTifs}
          selectedTif={tif}
          onSelect={onIntervalSelect}
        />
      </Box>
      <Box py={3}>
        <ConnectButton
          scheduled={isScheduled}
          disabled={!valid || submitting}
        />
      </Box>
    </form>
  );
};
