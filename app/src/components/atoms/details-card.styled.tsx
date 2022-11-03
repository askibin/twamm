import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export const Container = styled(Card)`
  justify-content: center;
  min-width: 125px;
`;

export const Content = styled(CardContent)`
  padding: 2px;
  text-align: center;
  border: 0;
`;

export const Title = styled(Typography)`
  font-size: 14px;
  white-space: nowrap;
`;
