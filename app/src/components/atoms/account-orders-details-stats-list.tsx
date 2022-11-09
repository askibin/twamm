import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as Styled from "./account-orders-details-stats-list.styled";

export interface Props {
  fields: { name: string; data: string }[];
}

const Item = ({ label, value }: { label: string; value: string }) => (
  <ListItem alignItems="flex-start">
    <ListItemText primary={label} secondary={<span>{value}</span>} />
  </ListItem>
);

export default ({ fields }: Props) => (
  <Styled.Container>
    {fields.map((field) => (
      <Item key={field.name} label={field.name} value={field.data} />
    ))}
  </Styled.Container>
);
