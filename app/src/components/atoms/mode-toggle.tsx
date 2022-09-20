import type { MouseEvent } from "react";
import { useCallback } from "react";

import * as Styled from "./mode-toggle.styled";

export interface Props {
  mode: string;
  onChange: (mode: string) => void;
}

export const modes = new Map([
  ["pools", "pools"],
  ["swap", "swap"],
  ["orders", "orders"],
]);

export default ({ mode, onChange: handleChange = () => {} }: Props) => {
  const onChange = useCallback(
    (_: MouseEvent<HTMLElement>, value: string | null) => {
      if (value) handleChange(value);
    },
    [handleChange]
  );

  const pools = modes.get("pools") as string;
  const swap = modes.get("swap") as string;
  const orders = modes.get("orders") as string;

  return (
    <Styled.ModeButtonGroup
      value={mode}
      exclusive
      onChange={onChange}
      aria-label="mode"
    >
      <Styled.ModeButton value={pools} aria-label={pools}>
        Pools
      </Styled.ModeButton>
      <Styled.ModeButton value={swap} aria-label={swap}>
        Swap
      </Styled.ModeButton>
      <Styled.ModeButton value={orders} aria-label={orders}>
        Orders
      </Styled.ModeButton>
    </Styled.ModeButtonGroup>
  );
};
