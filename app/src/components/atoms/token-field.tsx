import type { MouseEvent, SyntheticEvent } from "react";
import { useCallback, useMemo, useState } from "react";

import * as Styled from "./token-field.styled";

export interface Props {
  alt?: string;
  image?: string;
  label: string;
  onClick: (e: MouseEvent) => void;
}

export default ({ label, onClick, alt, image }: Props) => {
  const [amount, setAmount] = useState<number>(0);

  const onChange = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (!isNaN(Number(value))) {
        setAmount(Number(value));
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
