import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import * as Styled from "./account-orders-details-stats-list.styled";

export interface Props {
  fields: { name: string; data: string }[];
}

const Item = ({
  label,
  value,
}: {
  label: string;
  value: string | string[];
}) => {
  const secondary = Array.isArray(value) ? (
    <Box>
      {value.map((v, i) => {
        const key = `${v}-${i}`;

        return (
          <Styled.Item key={key} variant="body2">
            {v}
          </Styled.Item>
        );
      })}
    </Box>
  ) : (
    <span>{value}</span>
  );

  return (
    <ListItem alignItems="flex-start">
      <ListItemText primary={label} secondary={secondary} />
    </ListItem>
  );
};

export default ({ fields }: Props) => (
  <Styled.Container>
    {fields.map((field) => {
      const dataArr = field.data.split("|");

      if (dataArr.length === 1) {
        return <Item key={field.name} label={field.name} value={field.data} />;
      }

      return <Item key={field.name} label={field.name} value={dataArr} />;
    })}
  </Styled.Container>
);
