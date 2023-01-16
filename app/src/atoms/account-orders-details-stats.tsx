import Box from "@mui/material/Box";
import { useMemo } from "react";

import StatsList from "./account-orders-details-stats-list";
import StatsCards from "./account-orders-details-stats-cards";
import useBreakpoints from "../hooks/use-breakpoints";
import { format } from "./account-orders-details-stats.helpers";
import { formatInterval } from "../utils/index";

export default ({
  details,
  quantity,
  filledQuantity,
  timeInForce,
}: {
  details: PoolDetails;
  quantity: number;
  filledQuantity: number;
  timeInForce: number;
}) => {
  const { isMobile } = useBreakpoints();

  const statsSizes = useMemo(() => ({ xs: 6, sm: 6, md: 4 }), []);

  const fields = useMemo(
    () => [
      {
        name: "Time Frame",
        data: formatInterval(timeInForce),
      },
      {
        name: "Pool Expiration",
        data: format.expirationTime(details),
      },
      {
        name: "Filled/Quantity",
        data: `${filledQuantity}|${quantity}`,
      },
      {
        name: "Total Assets",
        data: format.totalAssets(details),
      },
      {
        name: "Min/Avg/Max Price",
        data: format.prices(details),
      },
      {
        name: "Your average price",
        data: format.userAveragePrice(details),
      },
      {
        name: "Pool Inception",
        data: format.inceptionTime(details),
      },
      {
        name: "Last Changed",
        data: format.lastBalanceChangeTime(details),
      },
    ],
    [details, filledQuantity, quantity, timeInForce]
  );

  return (
    <Box>
      {isMobile ? (
        <StatsList fields={fields} />
      ) : (
        <StatsCards fields={fields} sizes={statsSizes} />
      )}
    </Box>
  );
};
