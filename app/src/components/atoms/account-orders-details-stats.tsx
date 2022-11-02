import { useMemo } from "react";

import * as Styled from "./account-orders-details-stats.styled";
import DetailsCard from "./details-card";
import { format } from "./account-orders-details-stats.helpers";

export interface Props {
  details: PoolDetails;
}

export default ({ details }: Props) => {
  const sizes = useMemo(() => ({ xs: 4, sm: 4, md: 3 }), []);

  const fields = useMemo(
    () => [
      {
        name: "Pool Inception",
        data: format.inceptionTime(details),
      },
      {
        name: "Pool Expiration",
        data: format.expirationTime(details),
      },
      {
        name: "Last Changed",
        data: format.lastBalanceChangeTime(details),
      },
      {
        name: "Total Assets",
        data: format.totalAssets(details),
      },
      {
        name: "Min/Avg/Max Price",
        data: format.prices(details),
      },
    ],
    [details]
  );

  return (
    <>
      <Styled.Column item md={sizes.md} sm={sizes.sm} xs={sizes.xs}>
        <DetailsCard data={fields[0].data} name={fields[0].name} />
      </Styled.Column>
      <Styled.Column item md={sizes.md} sm={sizes.sm} xs={sizes.xs}>
        <DetailsCard data={fields[1].data} name={fields[1].name} />
      </Styled.Column>
      <Styled.Column item md={sizes.md} sm={sizes.sm} xs={sizes.xs}>
        <DetailsCard data={fields[2].data} name={fields[2].name} />
      </Styled.Column>
      <Styled.Column item md={sizes.md} sm={sizes.sm} xs={sizes.xs}>
        <DetailsCard data={fields[3].data} name={fields[3].name} />
      </Styled.Column>
      <Styled.Column item md={sizes.md} sm={sizes.sm} xs={sizes.xs}>
        <DetailsCard data={fields[4].data} name={fields[4].name} />
      </Styled.Column>
    </>
  );
};
