import type { PublicKey } from "@solana/web3.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import Maybe from "easy-maybe/lib";

import * as Styled from "./cancel-order-modal.styled";
import CancelOrderAmount from "./cancel-order-amount";
import CancelOrderDetails from "./cancel-order-details";
import { isFloat } from "../../utils/index";
import { useJupTokensByMint } from "../../hooks/use-jup-tokens-by-mint";

export interface Props {
  amount: number;
  mints: [PublicKey, PublicKey];
  onApprove: (arg0: number) => void;
  supply: number[];
}

const hydrateAmount = (a: number) => (isFloat(a) ? Number(a.toFixed(6)) : a);

export default ({ amount: orderAmount, mints, onApprove, supply }: Props) => {
  const [amount, setAmount] = useState<number>(orderAmount);
  const [percentage, setPercentage] = useState<number>(100);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const tokens = useJupTokensByMint(mints && mints.map((m) => m.toBase58()));

  console.log(tokens.data);

  const onAmountChange = useCallback(
    (value: number) => {
      setPercentage(value);
      setAmount(hydrateAmount(value * amount));
    },
    [amount]
  );

  const onCancel = useCallback(() => {
    onApprove(0);
  }, [onApprove]);

  const onToggleDetails = useCallback(() => {
    setDetailsOpen((prev) => !prev);
  }, [setDetailsOpen]);

  return (
    <Styled.Container>
      <Typography pt={3} pb={2} align="center" variant="h4">
        Cancel Order
      </Typography>
      <Box p={2}>
        <CancelOrderAmount
          percentage={percentage}
          onChange={onAmountChange}
          onToggleDetails={onToggleDetails}
        />
      </Box>
      <CancelOrderDetails
        data={Maybe.of(tokens.data)}
        open={detailsOpen}
        onToggle={onToggleDetails}
      />
      <Box p={2}>
        <Button
          disabled={!percentage}
          variant="contained"
          fullWidth
          onClick={onCancel}
        >
          Approve
        </Button>
      </Box>
    </Styled.Container>
  );
};
