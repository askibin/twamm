import Grid from "@mui/material/Grid";

import * as Styled from "./account-orders-details-stats-cards.styled";
import DetailsCard from "./details-card";

export interface Props {
  fields: { name: string; data: string }[];
  sizes: { xs: number; sm: number; md: number };
}

export default ({ fields, sizes }: Props) => (
  <Grid container py={2}>
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
  </Grid>
);
