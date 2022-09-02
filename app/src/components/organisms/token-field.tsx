import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
//import Grid from "@mui/material/Grid";
//import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";

export interface Props {
  onClick: () => void;
}

export default function TokenField({ onClick, ...props }: Props) {
  return <TextField fullWidth onClick={onClick} {...props} />;
}
