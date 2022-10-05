import Grid from "@mui/material/Grid";

import TokenField from "../atoms/token-field";
import TokenSelect from "../atoms/token-select";
import * as Styled from "./in-token-field.styled";

export interface Props {
  name?: string;
  src?: string;
  onSelect: () => void;
}

export default ({ name = "-", src, onSelect }: Props) => {
  const { data: total } = { data: 0 };

  return (
    <Styled.TokenField>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <TokenSelect alt={name} image={src} label={name} onClick={onSelect} />
        </Grid>
        <Grid item xs={8}>
          <TokenField alt={name} image={src} label="Pay" onClick={onSelect} />
          <Styled.TokenTotal>
            {total ?? "-"} {name}
          </Styled.TokenTotal>
        </Grid>
      </Grid>
    </Styled.TokenField>
  );
};
