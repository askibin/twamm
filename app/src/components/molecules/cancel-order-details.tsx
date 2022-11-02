import Box from "@mui/material/Box";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Maybe from "easy-maybe/lib";

import * as Styled from "./cancel-order-details.styled";
import CancelOrderLiquidity from "./cancel-order-liquidity";
import Loading from "../atoms/loading";
import { refreshEach } from "../../swr-options";
import { usePrice } from "../../hooks/use-price";

export interface Props {
  data: Voidable<JupTokenData[]>;
  onToggle: () => void;
}

export default ({ data, onToggle }: Props) => {
  const d = Maybe.of(data);

  const tokens = Maybe.withDefault(undefined, d);
  const priceParams = Maybe.withDefault(
    undefined,
    Maybe.andMap((t) => {
      const [{ symbol: id }, { symbol: vsToken }] = t;
      return { id, vsToken };
    }, d)
  );

  const price = usePrice(priceParams, refreshEach(10000));

  if (!tokens) return <Loading />;

  return (
    <>
      <Styled.OperationImage>
        <Styled.OperationButton onClick={onToggle}>
          <ArrowDownwardIcon />
        </Styled.OperationButton>
      </Styled.OperationImage>
      <Box p={2}>
        <CancelOrderLiquidity
          ab={tokens}
          errorData={price.error}
          priceData={price.data}
        />
      </Box>
    </>
  );
};
