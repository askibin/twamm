import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Slider from "@mui/material/Slider";
import { useCallback, useMemo } from "react";

import * as Styled from "./cancel-order-amount.styled";
import { isFloat } from "../../utils/index";

export interface Props {
  amount: number;
  part: number;
  onChange: (amount: number) => void;
}

const labelFormat = (value: number) =>
  isFloat(value) ? `${Math.round(value)}%` : `${value}%`;

export default ({ amount, part, onChange }: Props) => {
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
    (e: Event, value: number | number[]) => {
      if (Array.isArray(value)) {
        onChange(value[0] / 100);
      } else {
        onChange(value / 100);
      }
    },
    [onChange]
  );

  return (
    <Card>
      <Styled.Title variant="h6">Amount</Styled.Title>
      <CardContent>
        <Styled.Amount>{amount}</Styled.Amount>
        <Box p={2}>
          <Slider
            defaultValue={100}
            getAriaValueText={labelFormat}
            marks={marks}
            onChange={onPercentageChange}
            value={part ? part * 100 : 0}
            valueLabelDisplay="auto"
            valueLabelFormat={labelFormat}
          />
        </Box>
        <Styled.Values direction="row" spacing={2}>
          <Chip
            color={part === 0.25 ? "secondary" : undefined}
            label="25%"
            onClick={() => onChange(0.25)}
            variant="outlined"
          />
          <Chip
            color={part === 0.5 ? "secondary" : undefined}
            label="50%"
            onClick={() => onChange(0.5)}
            variant="outlined"
          />
          <Chip
            color={part === 0.75 ? "secondary" : undefined}
            label="75%"
            onClick={() => onChange(0.75)}
            variant="outlined"
          />
          <Chip
            label="max"
            variant="outlined"
            color={part === 1 ? "secondary" : undefined}
            onClick={() => onChange(1)}
          />
        </Styled.Values>
      </CardContent>
    </Card>
  );
};
