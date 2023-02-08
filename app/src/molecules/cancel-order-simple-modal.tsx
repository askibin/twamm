import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Maybe, { Extra } from "easy-maybe/lib";
import type { PublicKey } from "@solana/web3.js";
import Typography from "@mui/material/Typography";
import { BN } from "@project-serum/anchor";
import { useCallback } from "react";

import * as Styled from "./cancel-order-simple-modal.styled";
import i18n from "../i18n";
import Loading from "../atoms/loading";

export default ({
  data,
  onClick,
}: {
  data?: CancelOrderData;
  onClick: (arg0: { a: PublicKey; b: PublicKey; supply: BN }) => void;
}) => {
  const order = Maybe.of(data);

  const onCancel = useCallback(() => {
    Maybe.tap((d) => {
      onClick({
        a: d.a,
        b: d.b,
        supply: new BN(Number.MAX_SAFE_INTEGER),
      });
    }, order);
  }, [onClick, order]);

  return (
    <Styled.Container>
      <Typography pt={3} pb={2} align="center" variant="h4">
        {i18n.OrderFlowCancelTitle}
      </Typography>
      {Extra.isNothing(order) && <Loading />}
      {Extra.isJust(order) && (
        <>
          <Box p={2}>
            <Alert severity="warning" variant="filled">
              <AlertTitle>{i18n.Warning}</AlertTitle>
              {i18n.OrderCollisionWarning}
            </Alert>
          </Box>
          <Box p={2}>
            <Button variant="contained" fullWidth onClick={onCancel}>
              {i18n.OrderControlCancelConcurrentOrder}
            </Button>
          </Box>
        </>
      )}
    </Styled.Container>
  );
};
