import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import M, { Extra } from "easy-maybe/lib";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { useCallback } from "react";
import * as Styled from "./exchange-pair-form.styled";
import AmountField from "../atoms/amount-field";
import InTokenField from "./in-token-field";
import TokenSelect from "../atoms/token-select";
import TradeIntervals from "./trade-intervals";
import usePrice from "../hooks/use-price";
import type { PoolTIF, SelectedTIF } from "../domain/interval.d";
import { SpecialIntervals } from "../domain/interval.d";

export default ({
  amount,
  intervalTifs,
  primary,
  minTimeTillExpiration,
  onABSwap,
  onASelect,
  onBSelect,
  onChange,
  onChangeAmount,
  onInstantIntervalSelect,
  onIntervalSelect,
  onSubmit,
  secondary,
  submitting,
  tif,
}: {
  amount?: number;
  intervalTifs: Voidable<PoolTIF[]>;
  primary: Voidable<JupToken>;
  minTimeTillExpiration: Voidable<number>;
  onABSwap: () => void;
  onASelect: () => void;
  onBSelect: () => void;
  onChange: () => void;
  onChangeAmount: (arg0: number) => void;
  onInstantIntervalSelect: () => void;
  onIntervalSelect: (tif: SelectedTIF) => void;
  onSubmit: () => void;
  secondary: Voidable<JupToken>;
  submitting: boolean;
  tif?: SelectedTIF;
}) => {
  const [a, b] = [primary, secondary];

  const isInstantEnabled =
    tif && tif[0] === SpecialIntervals.INSTANT ? true : undefined;

  const instantParams = M.andMap(
    ([c, d, e]) => ({
      id: c.symbol,
      vsToken: d.symbol,
      vsAmount: String(e),
    }),
    Extra.combine3([M.of(a), M.of(b), M.of(amount)])
  );

  const instantPrice = usePrice(
    M.withDefault(
      undefined,
      M.andMap(
        ([params]) => params,
        Extra.combine2([instantParams, M.of(isInstantEnabled)])
      )
    )
  );

  const instantAmount = M.withDefault(
    0,
    M.andMap(
      ([q, price]) => q * price,
      Extra.combine2([M.of(amount), M.of(instantPrice.data)])
    )
  );

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
  const handleIntervalSelect = useCallback(
    (value: SelectedTIF) => {
      onIntervalSelect(value);
      onChange();
    },
    [onChange, onIntervalSelect]
  );
  const handleInstantIntervalSelect = useCallback(() => {
    onInstantIntervalSelect();
    onChange();
  }, [onChange, onInstantIntervalSelect]);

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
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <TokenSelect
              alt={b?.symbol}
              disabled={!a}
              image={b?.logoURI}
              label={b?.symbol}
              onClick={handleOutputSelect}
            />
          </Grid>
          {isInstantEnabled && (
            <Grid item xs={12} sm={8}>
              <AmountField disabled amount={Number(instantAmount.toFixed(9))} />
            </Grid>
          )}
        </Grid>
      </Box>
      <Box py={2}>
        <TradeIntervals
          disabled={submitting}
          indexedTifs={intervalTifs}
          minTimeTillExpiration={minTimeTillExpiration}
          onSelect={handleIntervalSelect}
          onSelectInstant={handleInstantIntervalSelect}
          selectedTif={tif}
        />
      </Box>
    </form>
  );
};
