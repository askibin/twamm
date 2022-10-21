import type { PublicKey } from "@solana/web3.js";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { useCallback, useMemo } from "react";

import * as Styled from "./account-order-details.styled";
import Control from "../atoms/account-orders-details-control";
import DataCard from "../atoms/details-card";
import Loading from "../atoms/loading";
import Maybe from "../../types/maybe";
import WalletGuard from "./wallet-guard";
import { usePoolDetails } from "../../hooks/use-pool-details";
import { format } from "./account-order-details.helpers";

export interface Props {
  address: PublicKey;
}

export default ({ address }: Props) => {
  const details = usePoolDetails(address);

  const fields = useMemo(() => {
    const data = Maybe.of(details.data);

    return [
      {
        name: "Pool Inception",
        data: format.inceptionTime(data),
      },
      {
        name: "Pool Expiration",
        data: format.expirationTime(data),
      },
      {
        name: "Last Changed",
        data: format.lastBalanceChangeTime(data),
      },
      {
        name: "Total Assets",
        data: format.totalAssets(data),
      },
      {
        name: "Min/Avg/Max Price",
        data: format.prices(data),
      },
    ];
  }, [details.data]);

  const sizes = useMemo(() => ({ xs: 4, sm: 4, md: 3 }), []);

  const onCancelOrder = useCallback(() => {
    // console.log("onCancel");
  }, []);

  if (details.isLoading)
    return (
      <Styled.Container>
        <Loading />
      </Styled.Container>
    );

  return (
    <Styled.Container>
      <WalletGuard>
        <Stack direction="column" spacing={2}>
          <Grid container spacing={2} wrap="wrap">
            <Styled.Column item md={sizes.md} sm={sizes.sm} xs={sizes.xs}>
              <DataCard data={fields[0].data} name={fields[0].name} />
            </Styled.Column>
            <Styled.Column item md={sizes.md} sm={sizes.sm} xs={sizes.xs}>
              <DataCard data={fields[1].data} name={fields[1].name} />
            </Styled.Column>
            <Styled.Column item md={sizes.md} sm={sizes.sm} xs={sizes.xs}>
              <DataCard data={fields[2].data} name={fields[2].name} />
            </Styled.Column>
            <Styled.Column item md={sizes.md} sm={sizes.sm} xs={sizes.xs}>
              <DataCard data={fields[3].data} name={fields[3].name} />
            </Styled.Column>
            <Styled.Column item md={sizes.md} sm={sizes.sm} xs={sizes.xs}>
              <DataCard data={fields[4].data} name={fields[4].name} />
            </Styled.Column>
          </Grid>
          <Control details={Maybe.of(details.data)} onClick={onCancelOrder} />
        </Stack>
      </WalletGuard>
    </Styled.Container>
  );
};
