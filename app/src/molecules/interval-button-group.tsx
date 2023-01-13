import type { SyntheticEvent } from "react";
import { memo } from "react";

import * as Styled from "./interval-button-group.styled";
import IntervalButton from "../atoms/interval-button";
import { formatInterval } from "../utils/index";
import { SpecialIntervals } from "../reducers/trade-intervals.reducer.d";

const Instant = (props: {
  disabled: boolean;
  onSelect: (e: SyntheticEvent<HTMLElement>) => void;
  selected: boolean;
  value: Voidable<number>;
  values: Voidable<any>;
}) => {
  if (!props.values) return null;

  return (
    <IntervalButton
      disabled={props.disabled}
      onClick={props.onSelect}
      selected={props.selected}
      text="Instant"
      value={props.value}
    />
  );
};

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
            const text = formatInterval(value);

            // FEAT: allow support for other inervals
            if (value === SpecialIntervals.INSTANT)
              return (
                <Instant
                  disabled={disabled}
                  key={`interval-${value}`}
                  onSelect={onClick}
                  selected={selectedValue === SpecialIntervals.INSTANT}
                  value={value}
                  values={values}
                />
              );

            return (
              <IntervalButton
                disabled={disabled}
                key={`interval-${value}`}
                onClick={onClick}
                selected={selected}
                text={text}
                value={value}
              />
            );
          })}
      </>
    );
  }
);
