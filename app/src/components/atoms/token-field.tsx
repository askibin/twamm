import type { SyntheticEvent } from "react";
import { useCallback, useState } from "react";

import * as Styled from "./token-field.styled";

export interface Props {
  alt?: string;
  image?: string;
  onChange: (arg0: number) => void;
}

export default ({ onChange: handleChange = () => {}, alt, image }: Props) => {
  const [amount, setAmount] = useState<number>(0);

  const onChange = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      // @ts-ignore
      const { value } = e.target;

      const next = Number(value);
      if (!isNaN(next)) {
        setAmount(next);
        handleChange(next);
      }
    },
    [setAmount]
  );

  return (
    <Styled.TokenField>
      <Styled.TokenAmountTextField value={amount} onChange={onChange} />
      <Styled.TokenAmountInUSD>$0</Styled.TokenAmountInUSD>
    </Styled.TokenField>
  );
};
