import Button from "@mui/material/Button";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import Maybe, { Extra } from "../../types/maybe";

export interface Props {
  details: TMaybe<Partial<PoolDetails>>;
  onClick: () => void;
}

export default ({ details, onClick }: Props) => {
  const action = Maybe.andMap(
    ({ expired, inactive }) => (expired || inactive ? "Withdraw" : "Cancel"),
    details
  );

  const actionName = Maybe.withDefault(null, action);

  return Extra.isNothing(action) ? null : (
    <Button variant="outlined" onClick={onClick}>
      {actionName}
    </Button>
  );
};
