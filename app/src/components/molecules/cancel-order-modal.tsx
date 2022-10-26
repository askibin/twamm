import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";

import * as Styled from "./cancel-order-modal.styled";
import CancelOrderAmount from "./cancel-order-amount";
import { isFloat } from "../../utils/index";

export interface Props {
  amount: number;
  onApprove: (arg0: number) => void;
}

const hydrateAmount = (a: number) => (isFloat(a) ? Number(a.toFixed(6)) : a);

export default ({ amount: orderAmount, onApprove }: Props) => {
  const [amount, setAmount] = useState<number>(orderAmount);

  console.log({ orderAmount, amount });

  const onAmountChange = useCallback((value: number) => {
    setAmount(hydrateAmount(value * amount));
  }, []);

  const onCancel = useCallback(() => {
    onApprove(0);
  }, [onApprove]);

  return (
    <Styled.Container>
      <Typography pt={3} pb={2} align="center" variant="h4">
        Cancel Order
      </Typography>
      <Box p={2}>
        <CancelOrderAmount
          amount={amount}
          part={amount / orderAmount}
          onChange={onAmountChange}
        />
      </Box>
      <Box px={2}>
        <Button variant="contained" fullWidth onClick={onCancel}>
          Approve
        </Button>
      </Box>
    </Styled.Container>
  );
};
