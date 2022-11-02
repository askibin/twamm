import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Maybe, { Extra } from "easy-maybe/lib";
import Typography from "@mui/material/Typography";
import { BN } from "@project-serum/anchor";
import { useCallback, useState } from "react";

import * as Styled from "./cancel-order-modal.styled";
import CancelOrderAmount from "./cancel-order-amount";
import CancelOrderDetails from "./cancel-order-details";
import Loading from "../atoms/loading";
import { useJupTokensByMint } from "../../hooks/use-jup-tokens-by-mint";

export interface Props {
  onApprove: (arg0: CancelOrderData) => void;
  data: Voidable<CancelOrderData>;
}

export default ({ data, onApprove }: Props) => {
  const [percentage, setPercentage] = useState<number>(100);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const order = Maybe.of(data);

  const mints = Maybe.withDefault(
    undefined,
    Maybe.andMap(({ a, b }) => [a.toBase58(), b.toBase58()], order)
  );

  const tokens = useJupTokensByMint(mints);

  const onAmountChange = useCallback((value: number) => {
    setPercentage(value);
  }, []);

  const onCancel = useCallback(() => {
    Maybe.tap((cd) => {
      const { supply } = cd;
      const cancellableAmount = (supply.toNumber() * percentage) / 100;

      onApprove({
        ...cd,
        supply: new BN(cancellableAmount),
      });
    }, order);
  }, [onApprove, order, percentage]);

  const onToggleDetails = useCallback(() => {
    setDetailsOpen((prev) => !prev);
  }, [setDetailsOpen]);

  return (
    <Styled.Container>
      <Typography pt={3} pb={2} align="center" variant="h4">
        Cancel Order
      </Typography>
      {Extra.isNothing(order) && <Loading />}
      {Extra.isJust(order) && (
        <>
          <Box p={2}>
            <CancelOrderAmount
              percentage={percentage}
              onChange={onAmountChange}
              onToggleDetails={onToggleDetails}
            />
          </Box>
          {detailsOpen && (
            <CancelOrderDetails data={tokens.data} onToggle={onToggleDetails} />
          )}
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
        </>
      )}
    </Styled.Container>
  );
};
