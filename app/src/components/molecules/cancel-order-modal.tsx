import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";

import * as Styled from "./cancel-order-modal.styled";

export interface Props {
  onApprove: (arg0: number) => void;
}

export default ({ onApprove }: Props) => {
  const onCancel = useCallback(() => {
    onApprove(0);
  }, [onApprove]);

  return (
    <Styled.Container>
      <Typography pt={3} pb={2} align="center" variant="h4">
        Cancel Order
      </Typography>
      <Box p={2}>
        <Card>
          <CardContent>Tweak the amount section</CardContent>
        </Card>
      </Box>
      <Box px={2}>
        <Button variant="contained" fullWidth onClick={onCancel}>
          Approve
        </Button>
      </Box>
    </Styled.Container>
  );
};
