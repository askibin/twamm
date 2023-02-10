import type { BN } from "@project-serum/anchor";

export const lpAmount = (
  poolSide: PoolTradeSideData,
  order: { side: OrderTypeStruct; lpBalance: BN; tokenDebt: BN }
) => {
  let result;

  if (Number(poolSide.sourceBalance) === 0) {
    result = Number(order.lpBalance);
  } else {
    result =
      (Number(order.lpBalance) * Number(poolSide.lpSupply)) /
      Number(poolSide.sourceBalance);
  }

  return result;
};

export const withdrawAmount = (
  lpBalance: number | BN,
  poolSide: PoolTradeSideData,
  order: { side: OrderTypeStruct; lpBalance: BN; tokenDebt: BN },
  tokenPair: TokenPairProgramData
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
