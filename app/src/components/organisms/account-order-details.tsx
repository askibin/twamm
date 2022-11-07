import type { PublicKey } from "@solana/web3.js";
import type { BN } from "@project-serum/anchor";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Maybe, { Extra } from "easy-maybe/lib";
import { useCallback } from "react";

import * as Styled from "./account-order-details.styled";
import Control from "../atoms/account-orders-details-control";
import Loading from "../atoms/loading";
import Stats from "../atoms/account-orders-details-stats";
import usePoolDetails from "../../hooks/use-pool-details";

export interface Props {
  address: PublicKey;
  onCancel: (arg0: CancelOrderData) => void;
  side: OrderTypeStruct;
  supply: BN;
}

export default ({ address, onCancel, side, supply }: Props) => {
  const details = usePoolDetails(address);
  const data = Maybe.of(details.data);

  const onCancelOrder = useCallback(() => {
    Maybe.tap((d) => {
      const { aAddress, bAddress, expired, inactive, poolAddress } = d;

      onCancel({
        a: aAddress,
        b: bAddress,
        expired,
        inactive,
        poolAddress,
        side,
        supply,
      });
    }, data);
  }, [data, onCancel, side, supply]);

  if (details.isLoading || Extra.isNothing(data)) return <Loading />;

  const d = Extra.forkJust(data);

  return (
    <Styled.Container>
      <Stack direction="column" spacing={2}>
        <Grid container spacing={2} wrap="wrap">
          <Stats details={d} />
        </Grid>
        <Control
          expired={d.expired}
          inactive={d.inactive}
          onClick={onCancelOrder}
        />
      </Stack>
    </Styled.Container>
  );
};
