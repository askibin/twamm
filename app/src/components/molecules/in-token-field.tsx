import Grid from "@mui/material/Grid";

import type { Props as FieldProps } from "../atoms/token-field";
import type { Props as SelectProps } from "../atoms/token-select";
import * as Styled from "./in-token-field.styled";
import TokenField from "../atoms/token-field";
import TokenSelect from "../atoms/token-select";
import useBalance from "../../hooks/use-balance";

export interface Props {
  address?: string;
  name?: string;
  onChange: FieldProps["onChange"];
  onSelect: SelectProps["onClick"];
  src?: string;
}

export default ({ address, name, onChange, onSelect, src }: Props) => {
  const balance = useBalance(address);

  const displayName = name ?? "";

  return (
    <Styled.TokenField>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
          <TokenSelect
            alt={displayName}
            image={src}
            label={displayName}
            onClick={onSelect}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TokenField name={name} onChange={onChange} />
          <Styled.TokenTotal>
            Your Balance: {balance.data ?? "..."} {displayName}
          </Styled.TokenTotal>
        </Grid>
      </Grid>
    </Styled.TokenField>
  );
};
