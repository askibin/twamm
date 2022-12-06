import type { ChangeEvent } from "react";
import Maybe from "easy-maybe/lib";
import { useCallback, useState } from "react";

import * as Styled from "./token-field.styled";
import usePrice from "../../hooks/use-price";
import { isFloat } from "../../utils/index";

export interface Props {
  maxAmount?: number;
  name?: string;
  onChange: (arg0: number) => void;
}

export default ({ maxAmount, name, onChange: handleChange }: Props) => {
  const [amount, setAmount] = useState<number>(0);

  const price = usePrice(name ? { id: name } : undefined);

  const onMaxClick = useCallback(() => {
    if (!maxAmount) return;
    setAmount(maxAmount);
    handleChange(maxAmount);
  }, [handleChange, maxAmount, setAmount]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);

      setAmount(next);
      handleChange(next);
    },
    [handleChange, setAmount]
  );

  const amountUsd = Maybe.withDefault(
    undefined,
    Maybe.andMap((p) => String(p * amount), Maybe.of(price.data))
  );

  return (
    <Styled.TokenField>
      <Styled.TokenAmountTextField
        allowNegative={false}
        value={amount}
        onChange={onChange}
      />
      <Styled.SecondaryControls direction="row" spacing={1}>
        <Styled.TokenAmountInUSD>
          {!amountUsd || amountUsd === "0"
            ? `$0`
            : `~$${
                isFloat(amountUsd)
                  ? Number(amountUsd).toFixed(2)
                  : amountUsd ?? 0
              }`}
        </Styled.TokenAmountInUSD>
        <Styled.TokenAmountMaxButton
          disabled={!maxAmount}
          onClick={onMaxClick}
          size="small"
        >
          max
        </Styled.TokenAmountMaxButton>
      </Styled.SecondaryControls>
    </Styled.TokenField>
  );
};
