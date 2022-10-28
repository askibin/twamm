import Box from "@mui/material/Box";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import type { Maybe as TMaybe } from "../../types/maybe.d";
import CancelOrderLiquidity from "./cancel-order-liquidity";
import Maybe from "../../types/maybe";
import Loading from "../atoms/loading";
import * as Styled from "./cancel-order-details.styled";

export interface Props {
  data: TMaybe<JupTokenData[]>;
  onToggle: () => void;
  open: boolean;
}

export default ({ data, onToggle, open }: Props) => {
  const tokens = Maybe.withDefault(undefined, data);

  if (!open) return null;
  if (!tokens) return <Loading />;

  return (
    <>
      <Styled.OperationImage>
        <Styled.OperationButton onClick={onToggle}>
          <ArrowDownwardIcon />
        </Styled.OperationButton>
      </Styled.OperationImage>
      <Box p={2}>
        <CancelOrderLiquidity amount={amount} />
      </Box>
    </>
  );
};
