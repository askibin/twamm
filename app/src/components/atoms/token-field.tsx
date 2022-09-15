import type { MouseEvent } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

import styles from "./token-field.module.css";

export interface Props {
  alt: string;
  image: string;
  label: string;
  onClick: (e: MouseEvent) => void;
}

export default ({ label, onClick, alt, image }: Props) => (
  <Paper className={styles.tokenField} p={1} component={Box}>
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <TextField
          className={styles.tokenSelect}
          InputProps={{
            startAdornment: <Avatar alt={alt} src={image} />,
          }}
          onClick={onClick}
        />
      </Grid>
      <Grid item xs={9}>
        <TextField fullWidth label={label} />
      </Grid>
    </Grid>
  </Paper>
);
