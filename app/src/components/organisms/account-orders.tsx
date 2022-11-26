import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AccountOrdersList from "./account-orders-list";
import useOrders from "../../hooks/use-orders";
import { refreshEach } from "../../swr-options";

export default () => {
  const orders = useOrders(undefined, refreshEach(60000));

  return (
    <Box pb={2}>
      <Typography pb={2} variant="h4">
        Orders
      </Typography>
      <AccountOrdersList
        data={orders.data}
        error={orders.error}
        loading={orders.isLoading}
        updating={orders.isValidating}
      />
    </Box>
  );
};
