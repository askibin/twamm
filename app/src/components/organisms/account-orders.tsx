import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AccountOrdersList from "./account-orders-list";
import Maybe, { Extra } from "../../types/maybe";
import { ConnectWalletGuard } from "./wallet-guard";
import { refreshEach } from "../../swr-options";
import { useOrders } from "../../hooks/use-orders";

export default () => {
  const orders = useOrders(undefined, refreshEach());
  const data = Maybe.of(orders.data);

  return (
    <>
      <Box pb={2}>
        <Typography pb={2} variant="h4">
          My Orders
        </Typography>
        <AccountOrdersList
          data={data}
          error={Maybe.of(orders.error)}
          loading={orders.isLoading}
          updating={orders.isValidating}
        />
      </Box>
      {Extra.isNothing(data) && <ConnectWalletGuard sx={{ py: 2 }} />}
    </>
  );
};
