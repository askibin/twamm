import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Box from "@mui/material/Box";
import M, { Extra } from "easy-maybe/lib";
import { protocol } from "@twamm/client.js";

import type { PoolDetails } from "../types/decl.d";
import * as Styled from "./cancel-order-details.styled";
import CancelOrderLiquidity from "./cancel-order-liquidity";
import Loading from "../atoms/loading";
import usePrice from "../hooks/use-price";
import { refreshEach } from "../swr-options";

export interface Props {
  data?: JupToken[];
  details?: PoolDetails;
  onToggle: () => void;
  percentage: number;
}

export default ({ data, details, onToggle, percentage }: Props) => {
  const d = M.of(data);

  const tokens = M.withDefault(undefined, d);
  const priceParams = M.withDefault(
    undefined,
    M.andMap((t) => {
      const [{ symbol: id }, { symbol: vsToken }] = t;
      return { id, vsToken };
    }, d)
  );
  const withdrawAmount = M.andMap(([td, det]) => {
    const [a, b] = td;
    const { withdraw } = det;

    const [wda, wdb] = protocol.withdrawAmount(
      (withdraw.orderBalance.lpBalance * percentage) / 100,
      withdraw.tradeSide,
      withdraw.orderBalance,
      withdraw.tokenPair
    );

    const withdrawPair = [
      wda * 10 ** (a.decimals * -1),
      wdb * 10 ** (b.decimals * -1),
    ];

    return withdrawPair;
  }, Extra.combine2([d, M.of(details)]));

  // TODO: format result
  const amount = M.withDefault<Array<number | string>>(
    ["-", "-"],
    withdrawAmount
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
          amount={amount}
          errorData={price.error}
          priceData={price.data}
        />
      </Box>
    </>
  );
};
