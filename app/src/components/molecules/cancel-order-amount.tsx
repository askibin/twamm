import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Slider from "@mui/material/Slider";
import { memo, useCallback, useMemo } from "react";

import * as Styled from "./cancel-order-amount.styled";
import { isFloat } from "../../utils/index";

export interface Props {
  percentage: number;
  onChange: (amount: number) => void;
  onToggleDetails: () => void;
}

const labelFormat = (value: number) =>
  isFloat(value) ? `${Math.round(value)}%` : `${value}%`;

const values = [25, 50, 75, 100];

export default memo(({ percentage, onChange, onToggleDetails }: Props) => {
  const marks = useMemo(
    () => [
      {
        value: 0,
        label: labelFormat(0),
      },
    ],
    []
  );

  const onPercentageChange = useCallback(
    (_: Event, value: number | number[]) => {
      if (Array.isArray(value)) {
        onChange(value[0]);
      } else {
        onChange(value);
      }
    },
    [onChange]
  );

  return (
    <Card>
      <Styled.Header>
        <Styled.Title variant="h6">Amount</Styled.Title>
        <Styled.DetailsControl variant="body2" onClick={onToggleDetails}>
          Detailed
        </Styled.DetailsControl>
      </Styled.Header>
      <CardContent>
        <Styled.Amount>{percentage}%</Styled.Amount>
        <Box p={2}>
          <Slider
            defaultValue={100}
            getAriaValueText={labelFormat}
            marks={marks}
            onChange={onPercentageChange}
            value={percentage}
            valueLabelDisplay="auto"
            valueLabelFormat={labelFormat}
          />
        </Box>
        <Styled.Values direction="row" spacing={2}>
          {values.map((value) => (
            <Chip
              color={percentage === value ? "secondary" : undefined}
              key={`percentage-${value}`}
              label={`${value}%`}
              onClick={() => onChange(value)}
              variant="outlined"
            />
          ))}
        </Styled.Values>
      </CardContent>
    </Card>
  );
});
