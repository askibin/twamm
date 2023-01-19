import M from "easy-maybe/lib";
import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import * as Styled from "./token-field.styled";
import usePrice from "../hooks/use-price";
import { formatPrice } from "../domain/index";

export default ({
  maxAmount,
  name,
  onChange: handleChange,
}: {
  maxAmount?: number;
  name?: string;
  onChange: (arg0: number) => void;
}) => {
  const [amount, setAmount] = useState<number>(0);

  const price = usePrice(name ? { id: name } : undefined);

  const onMaxClick = useCallback(() => {
    M.andMap((max) => {
      setAmount(max);
      handleChange(max);
    }, M.of(maxAmount));
  }, [handleChange, maxAmount, setAmount]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);

      setAmount(next);
      handleChange(next);
    },
    [handleChange, setAmount]
  );

  const totalAmount = M.andThen<number, number>(
    (p) => (Number.isNaN(amount) ? M.of(undefined) : M.of(p * amount)),
    M.of(price.data)
  );

  const displayAmount = M.withDefault(
    "-",
    M.andMap(
      (a) => (a === 0 ? formatPrice(0) : `~${formatPrice(a)}`),
      totalAmount
    )
  );

  return (
    <Styled.TokenField>
      <Styled.TokenAmountTextField
        allowNegative={false}
        value={amount}
        onChange={onChange}
      />
      <Styled.SecondaryControls direction="row" spacing={1}>
        <Styled.TokenAmountInUSD>{displayAmount}</Styled.TokenAmountInUSD>
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
