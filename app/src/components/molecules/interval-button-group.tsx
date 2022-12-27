import type { SyntheticEvent } from "react";
import { memo } from "react";

import * as Styled from "./interval-button-group.styled";
import IntervalButton from "../atoms/interval-button";
import { formatInterval } from "../../utils/index";
import { instantTif } from "../../reducers/trade-intervals.reducer";

export interface Props {
  disabled: boolean;
  info?: string;
  label: string;
  useInstantOption?: boolean;
  value?: number;
  values?: number[];
  onClick: (arg0: number) => void;
  onSelectInstant?: (arg0: number) => void;
}

export const INSTANT_INTERVAL = instantTif;

export default memo(
  ({
    disabled,
    onClick,
    value: selectedValue,
    values,
  }: {
    disabled: boolean;
    onClick: (e: SyntheticEvent<HTMLElement>) => void;
    value?: number;
    values?: number[];
  }) => {
    if (!values) return <Styled.BlankIntervals variant="rectangular" />;

    return (
      <>
        {values
          .filter((value: number) => value !== 0)
          .map((value: number) => {
            const selected = value === selectedValue;

            return (
              <IntervalButton
                disabled={disabled}
                key={`interval-${value}`}
                onClick={onClick}
                selected={selected}
                text={formatInterval(value)}
                value={value}
              />
            );
          })}
      </>
    );
  }
);

export const Instant = (props: {
  onSelect: () => void;
  value: Voidable<number>;
  values: Voidable<any>;
}) => {
  if (!props.values) return null;

  const selected = props.value === INSTANT_INTERVAL;

  return (
    <IntervalButton
      selected={selected}
      onClick={props.onSelect}
      text="Instant"
      value={props.value}
    />
  );
};
