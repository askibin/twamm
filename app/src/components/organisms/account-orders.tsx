import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AccountOrdersList from "./account-orders-list";
import useOrders from "../../hooks/use-order-records";
import { ConnectWalletGuard } from "../organisms/wallet-guard";
import { refreshEach } from "../../swr-options";

export default () => {
  const orders = useOrders(undefined, refreshEach(60000));

  console.info(1, orders.data, orders.isValidating, orders.isLoading);

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
        />
      </ConnectWalletGuard>
    </Box>
  );
};
