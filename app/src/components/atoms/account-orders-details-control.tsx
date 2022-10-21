import Button from "@mui/material/Button";

import type { PoolDetails } from "../../hooks/use-pool-details";
import type { Maybe as TMaybe } from "../../types/maybe.d";
import Maybe from "../../types/maybe";

export interface Props {
  details: TMaybe<Partial<PoolDetails>>;
  onClick: () => void;
}

export default ({ details, onClick }: Props) => {
  const { expired, inactive } = Maybe.withDefault(
    { expired: false, inactive: false },
    details
  );

  const action = expired || inactive ? "Withdraw" : "Cancel";

  return (
    <Button variant="outlined" onClick={onClick}>
      {action}
    </Button>
  );
};
