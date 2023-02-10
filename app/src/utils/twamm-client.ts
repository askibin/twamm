import type { BN } from "@project-serum/anchor";
import type { PoolTradeSide, TokenPair } from "@twamm/types";

export const withdrawAmount = (
  lpBalance: number | BN,
  poolSide: PoolTradeSide,
  order: { side: OrderTypeStruct; lpBalance: BN; tokenDebt: BN },
  tokenPair: TokenPair
) => {
  const withdrawAmountSource =
    (Number(lpBalance) * Number(poolSide.sourceBalance)) /
    Number(poolSide.lpSupply);

  let withdrawAmountTarget =
    (Number(lpBalance) *
      (Number(poolSide.targetBalance) + Number(poolSide.tokenDebtTotal))) /
    Number(poolSide.lpSupply);

  const tokenDebtRemoved =
    (Number(order.tokenDebt) * Number(lpBalance)) / Number(order.lpBalance);

  if (withdrawAmountTarget > tokenDebtRemoved) {
    withdrawAmountTarget -= tokenDebtRemoved;
  } else {
    withdrawAmountTarget = 0;
  }

  const withdrawAmountFees =
    (withdrawAmountTarget * tokenPair.feeNumerator) / tokenPair.feeDenominator;

  const [withdrawAmountA, withdrawAmountB] =
    order.side.sell !== undefined
      ? [withdrawAmountSource, withdrawAmountTarget - withdrawAmountFees]
      : [withdrawAmountTarget - withdrawAmountFees, withdrawAmountSource];

  return [withdrawAmountA, withdrawAmountB];
};
