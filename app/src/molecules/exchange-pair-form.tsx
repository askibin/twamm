import Box from "@mui/material/Box";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import * as Styled from "./exchange-pair-form.styled";
import InTokenField from "./in-token-field";
import TokenSelect from "../atoms/token-select";
import TradeIntervals from "./trade-intervals";
import type { SelectedTif } from "./trade-intervals";

export interface Props {
  intervalTifs?: { tif: any; index: any; left: any }[];
  lead: Voidable<JupToken>;
  onABSwap: () => void;
  onASelect: () => void;
  onBSelect: () => void;
  onChange: () => void;
  onChangeAmount: (arg0: number) => void;
  onInstantIntervalSelect: () => void;
  onIntervalSelect: (tif: SelectedTif) => void;
  onSubmit: () => void;
  slave: Voidable<JupToken>;
  submitting: boolean;
  tif?: SelectedTif;
}

export default ({
  onChange,
  onSubmit,
  lead,
  slave,
  intervalTifs,
  onABSwap,
  onASelect,
  onBSelect,
  onChangeAmount,
  onInstantIntervalSelect,
  onIntervalSelect,
  submitting,
  tif,
}: Props) => {
  const [a, b] = [lead, slave];

  const handleChangeAmount = (value: number) => {
    onChangeAmount(value);
    onChange();
  };
  const handleSwap = () => {
    onABSwap();
    onChange();
  };
  const handleInputSelect = () => {
    onASelect();
    onChange();
  };
  const handleOutputSelect = () => {
    onBSelect();
    onChange();
  };
  const handleIntervalSelect = (value: SelectedTif) => {
    onIntervalSelect(value);
    onChange();
  };
  const handleInstantIntervalSelect = () => {
    onInstantIntervalSelect();
    onChange();
  };

  return (
    <form onSubmit={onSubmit} id="exchange-form">
      <Styled.TokenLabelBox>You pay</Styled.TokenLabelBox>
      <InTokenField
        address={a?.address}
        name={a?.symbol}
        onChange={handleChangeAmount}
        onSelect={handleInputSelect}
        src={a?.logoURI}
      />
      <Styled.OperationImage>
        <Styled.OperationButton disabled={!a || !b} onClick={handleSwap}>
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
          onClick={handleOutputSelect}
        />
      </Box>
      <Box py={2}>
        <TradeIntervals
          disabled={submitting}
          indexedTifs={intervalTifs}
          selectedTif={tif}
          onSelect={handleIntervalSelect}
          onSelectInstant={handleInstantIntervalSelect}
        />
      </Box>
    </form>
  );
};
