import Box from "@mui/material/Box";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

import type { SelectedTif } from "./trade-intervals";
import * as Styled from "./token-pair-form-content.styled";
import InTokenField from "./in-token-field";
import TokenSelect from "../atoms/token-select";
import TradeIntervals from "./trade-intervals";

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
  tokenA?: string;
  tokenAImage?: string;
  tokenB?: string;
  tokenBImage?: string;
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
  tokenA,
  tokenAImage,
  tokenB,
  tokenBImage,
  valid,
}: Props) => (
  <form onSubmit={handleSubmit}>
    <Styled.TokenLabelBox>You pay</Styled.TokenLabelBox>
    <InTokenField
      name={tokenA}
      onChange={onChangeAmount}
      src={tokenAImage}
      onSelect={onASelect}
    />
    <Styled.OperationImage>
      <Styled.OperationButton disabled={!tokenA || !tokenB} onClick={onABSwap}>
        <SyncAltIcon />
      </Styled.OperationButton>
    </Styled.OperationImage>
    <Styled.TokenLabelBox>You receive</Styled.TokenLabelBox>
    <Box pb={2}>
      <TokenSelect
        alt={tokenB}
        disabled={!tokenA}
        image={tokenBImage}
        label={tokenB}
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
    <Styled.ConnectBox py={3}>
      <Styled.ConnectButton type="submit" disabled={!valid || submitting}>
        {isScheduled ? "Schedule Order" : "Place Order"}
      </Styled.ConnectButton>
    </Styled.ConnectBox>
  </form>
);
