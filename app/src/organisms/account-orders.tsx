import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AccountOrdersList from "./account-orders-list";
import useOrders from "../hooks/use-order-records";
import { ConnectWalletGuard } from "./wallet-guard";
import { refreshEach } from "../swr-options";

const REFRESH_INTERVAL = 60000;

export default () => {
  const orders = useOrders(undefined, refreshEach(REFRESH_INTERVAL));

  return (
    <Box pb={2}>
      <Typography pb={2} variant="h4">
        Orders
      </Typography>
      <ConnectWalletGuard>
        <AccountOrdersList
          data={orders.data}
          error={orders.error}
          loading={orders.isLoading}
          updating={orders.isValidating}
          updatingInterval={REFRESH_INTERVAL}
        />
      </ConnectWalletGuard>
    </Box>
  );
};
