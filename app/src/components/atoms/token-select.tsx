import type { MouseEvent } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import * as Styled from "./token-select.styled";

export interface Props {
  alt?: string;
  image?: string;
  label?: string;
  onClick: (e: MouseEvent) => void;
}

export default ({ label, onClick, alt, image }: Props) => (
  <Styled.TokenField onClick={onClick}>
    <Styled.TokenIcon alt={alt} src={image} />
    <Styled.TokenName>{label}</Styled.TokenName>
    <Styled.TokenControl>
      <ArrowDropDownIcon />
    </Styled.TokenControl>
  </Styled.TokenField>
);
