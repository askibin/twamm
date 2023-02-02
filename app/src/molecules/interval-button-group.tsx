import type { SyntheticEvent } from "react";
import { isNil } from "ramda";

import * as Styled from "./interval-button-group.styled";
import IntervalButton from "../atoms/interval-button";
import { formatInterval } from "../utils/index";
import { SpecialIntervals } from "../domain/interval.d";

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

export default ({
  disabled,
  onClick,
  value: selectedValue,
  valueIndex,
  valuesOpt,
  values,
}: {
  disabled: boolean;
  onClick: (e: SyntheticEvent<HTMLElement>) => void;
  value?: number;
  valueIndex?: number;
  valuesOpt: number;
  values?: number[];
}) => {
  if (!values) return <Styled.BlankIntervals variant="rectangular" />;

  return (
    <>
      {values
        .map((value: number, index) => {
          const isWildcardSelected = selectedValue === -1 && index === 0;
          const isIntervalSelected =
            !isNil(valueIndex) && index === valueIndex + valuesOpt;

          return {
            value,
            selected: isWildcardSelected || isIntervalSelected,
          };
        })
        .filter((d) => d.value !== 0)
        .map(({ value, selected }) => {
          // const selected = value === selectedValue;
          const text = formatInterval(value);
          const isComplementaryInterval = values.length === 1 && values[0] > 0;
          // make the interval selected when using scheduled interval
          const isSelected = selected || isComplementaryInterval;

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
              selected={isSelected}
              text={text}
              value={value}
            />
          );
        })}
    </>
  );
};
