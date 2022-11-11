import Box from "@mui/material/Box";
import { useMemo } from "react";

import StatsList from "./account-orders-details-stats-list";
import StatsCards from "./account-orders-details-stats-cards";
import useBreakpoints from "../../hooks/use-breakpoints";
import { format } from "./account-orders-details-stats.helpers";

export interface Props {
  details: PoolDetails;
}

export default ({ details }: Props) => {
  const { isMobile } = useBreakpoints();

  const statsSizes = useMemo(() => ({ xs: 6, sm: 6, md: 4 }), []);

  const fields = useMemo(
    () => [
      {
        name: "Pool Inception",
        data: format.inceptionTime(details),
      },
      {
        name: "Pool Expiration",
        data: format.expirationTime(details),
      },
      {
        name: "Last Changed",
        data: format.lastBalanceChangeTime(details),
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
    ],
    [details]
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
