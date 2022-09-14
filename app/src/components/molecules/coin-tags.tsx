import type { MouseEvent } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import styles from "./coin-tags.module.css";

export interface Props {
  coins: Array<{ symbol: string; image: string; name: string }>;
  onClick: (arg0: MouseEvent, arg1: string) => void;
}

export default ({ coins, onClick = () => {} }: Props) => (
  <Stack className={styles.root} direction="row" mt={2}>
    {coins.map(({ image, name, symbol }) => (
      <Chip
        sx={{ mr: 1, mb: 1 }}
        className={styles.coin}
        component={Button}
        variant="outlined"
        avatar={<Avatar alt={name} src={image} />}
        onClick={(e: MouseEvent) => onClick(e, symbol)}
        label={symbol.toUpperCase()}
      />
    ))}
  </Stack>
);
