import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import styles from "./coin-tags.module.css";

export interface Props {
  className: string;
  coins: Array<{ symbol: string; image: string; name: string }>;
}

export default ({ className, coins }: Props) => (
  <Stack className={className} direction="row" spacing={1}>
    {coins.map(({ image, name, symbol }) => (
      <Chip
        className={styles.coin}
        avatar={<Avatar alt={name} src={image} />}
        label={symbol.toUpperCase()}
        variant="outlined"
      />
    ))}
  </Stack>
);
