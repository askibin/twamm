import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Maybe, { Extra } from "easy-maybe/lib";
import Typography from "@mui/material/Typography";
import { BN } from "@project-serum/anchor";
import { useCallback, useState } from "react";

import * as Styled from "./cancel-order-simple-modal.styled";
import Loading from "../atoms/loading";

export interface Props {
  data: Voidable<CancelOrderData>;
  onApprove: (arg0: CancelOrderData) => void;
}

export default ({ data, onApprove }: Props) => {
  const [percentage] = useState<number>(100);

  const order = Maybe.of(data);

  const mints = Maybe.withDefault(
    undefined,
    Maybe.andMap(({ a, b }) => [a.toBase58(), b.toBase58()], order)
  );

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

  console.log("3453");

  return (
    <Styled.Container>
      <Typography pt={3} pb={2} align="center" variant="h4">
        Cancel Order
      </Typography>
      {Extra.isNothing(order) && <Loading />}
      {Extra.isJust(order) && (
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
      )}
    </Styled.Container>
  );
};
