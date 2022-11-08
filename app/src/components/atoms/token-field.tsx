import type { ChangeEvent } from "react";
import Maybe from "easy-maybe/lib";
import { useCallback, useState } from "react";

import * as Styled from "./token-field.styled";
import usePrice from "../../hooks/use-price";

export interface Props {
  name?: string;
  onChange: (arg0: number) => void;
}

export default ({ name, onChange: handleChange }: Props) => {
  const [amount, setAmount] = useState<number>(0);

  const price = usePrice(name ? { id: name } : undefined);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);

      setAmount(next);
      handleChange(next);
    },
    [handleChange, setAmount]
  );

  const amountUsd = Maybe.withDefault(
    "-",
    Maybe.andMap((p) => String(Math.round(p) * amount), Maybe.of(price.data))
  );

  return (
    <Styled.TokenField>
      <Styled.TokenAmountTextField
        allowNegative={false}
        value={amount}
        onChange={onChange}
      />
      <Styled.TokenAmountInUSD>~${amountUsd}</Styled.TokenAmountInUSD>
    </Styled.TokenField>
  );
};
