import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";

import * as Styled from "./token-field.styled";

export interface Props {
  onChange: (arg0: number) => void;
}

export default ({ onChange: handleChange }: Props) => {
  const [amount, setAmount] = useState<number>(0);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);

      setAmount(next);
      handleChange(next);
    },
    [handleChange, setAmount]
  );

  return (
    <Styled.TokenField>
      <Styled.TokenAmountTextField
        allowNegative={false}
        value={amount}
        onChange={onChange}
      />
      <Styled.TokenAmountInUSD>$0</Styled.TokenAmountInUSD>
    </Styled.TokenField>
  );
};
