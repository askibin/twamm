import Typography from "@mui/material/Typography";

import * as Styled from "./details-card.styled";

export interface Props {
  name: string;
  data: string;
}

export default ({ data, name }: Props) => (
  <Styled.Container elevation={0}>
    <Styled.Content>
      <Styled.Title color="text.secondary" gutterBottom>
        {name}
      </Styled.Title>
      <Typography variant="body2">{data}</Typography>
    </Styled.Content>
  </Styled.Container>
);
