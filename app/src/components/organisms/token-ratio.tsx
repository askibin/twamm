/* eslint-disable */
// TODO: remove ^
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useCallback, useRef } from "react";

import CoinPopover from "./coin-popover";
import TokenField from "./token-field";

export interface Props {
  tokenA: string;
  tokenB: string;
  tokenAValue: number;
  tokenBValue: number;
}

export default function TokenRatio(props: Props) {
  const popoverRef = useRef<{ isOpened: boolean; open: () => void }>();
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {},
  });

  const onTokenAChoose = useCallback(() => {
    console.log(props); // eslint-disable-line no-console

    if (!popoverRef.current?.isOpened) popoverRef.current?.open();
  }, [popoverRef]);

  return (
    <>
      <CoinPopover ref={popoverRef} />
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ my: 3 }}>
          <Typography color="textPrimary" variant="h4">
            Sign in
          </Typography>
          <Typography color="textSecondary" gutterBottom variant="body2">
            Sign in on the internal platform
          </Typography>
        </Box>
        <Box
          sx={{
            pb: 1,
            pt: 3,
          }}
        >
          <Typography align="center" color="textSecondary" variant="body1">
            or login with email address
          </Typography>
        </Box>
        <TokenField onClick={onTokenAChoose} />
        <TextField
          error={Boolean(formik.touched.email && formik.errors.email)}
          fullWidth
          helperText={formik.touched.email && formik.errors.email}
          label="Email Address"
          margin="normal"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          value={formik.values.email}
          variant="outlined"
        />
        <TextField
          error={Boolean(formik.touched.password && formik.errors.password)}
          fullWidth
          helperText={formik.touched.password && formik.errors.password}
          label="Password"
          margin="normal"
          name="password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.password}
          variant="outlined"
        />
        <Box sx={{ py: 2 }}>
          <Button
            color="primary"
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Sign In Now
          </Button>
        </Box>
      </form>
    </>
  );
}
