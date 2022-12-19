import Box from "@mui/material/Box";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import * as Styled from "./token-pair-form-content.styled";
import ConnectButton from "../atoms/token-pair-form-content-button";
import InTokenField from "./in-token-field";
import TokenSelect from "../atoms/token-select";
import TradeIntervals from "./trade-intervals";
import type { SelectedTif } from "./trade-intervals";

export interface Props {
  handleSubmit: () => void;
  lead: Voidable<JupToken>;
  slave: Voidable<JupToken>;
  intervalTifs?: { tif: any; index: any; left: any }[];
  isScheduled?: boolean;
  onABSwap: () => void;
  onASelect: () => void;
  onBSelect: () => void;
  onChangeAmount: (arg0: number) => void;
  onInstantIntervalSelect: () => void;
  onIntervalSelect: (tif: SelectedTif) => void;
  submitting: boolean;
  tif?: SelectedTif;
  valid: boolean;
}

export default ({
  handleSubmit,
  lead,
  slave,
  intervalTifs,
  isScheduled,
  onABSwap,
  onASelect,
  onBSelect,
  onChangeAmount,
  onInstantIntervalSelect,
  onIntervalSelect,
  submitting,
  tif,
  valid,
}: Props) => {
  const [a, b] = [lead, slave];

  return (
    <form onSubmit={handleSubmit}>
      <Styled.TokenLabelBox>You pay</Styled.TokenLabelBox>
      <InTokenField
        address={a?.address}
        name={a?.symbol}
        onChange={onChangeAmount}
        onSelect={onASelect}
        src={a?.logoURI}
      />
      <Styled.OperationImage>
        <Styled.OperationButton disabled={!a || !b} onClick={onABSwap}>
          <SyncAltIcon />
        </Styled.OperationButton>
      </Styled.OperationImage>
      <Styled.TokenLabelBox>You receive</Styled.TokenLabelBox>
      <Box pb={2}>
        <TokenSelect
          alt={b?.symbol}
          disabled={!a}
          image={b?.logoURI}
          label={b?.symbol}
          onClick={onBSelect}
        />
      </Box>
      <Box py={2}>
        <TradeIntervals
          indexedTifs={intervalTifs}
          selectedTif={tif}
          onSelect={onIntervalSelect}
          onSelectInstant={onInstantIntervalSelect}
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
