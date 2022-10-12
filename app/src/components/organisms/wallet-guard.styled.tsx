import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";

export const Container = styled(Card)`
  background: transparent;
  border: 0;
  margin: 0 auto;
`;

export const Inner = styled(CardContent)`
  max-width: var(--min-width);
`;
