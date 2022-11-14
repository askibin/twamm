import type { Address, BN } from "@project-serum/anchor";
import { NATIVE_MINT, createCloseAccountInstruction } from "@solana/spl-token";
import { isNativeToken } from "@twamm/client.js/lib/program";
import { PublicKey } from "@solana/web3.js";
import { translateAddress } from "@project-serum/anchor";

const SOL_ADDRESS = NATIVE_MINT.toBase58();

export const address = (account: Address) => ({
  toString() {
    return translateAddress(account).toBase58();
  },
  toAddress() {
    return translateAddress(account);
  },
});

export class NativeToken {
  public static address = SOL_ADDRESS;

  public static closeAccountInstruction(
    mint: PublicKey,
    tokenAccountAddress: PublicKey,
    walletAddress: PublicKey
  ) {
    let result;

    if (isNativeToken(mint)) {
      result = createCloseAccountInstruction(
        tokenAccountAddress,
        walletAddress,
        walletAddress
      );
    }

    return result;
  }
}

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
  lpBalance: number,
  poolSide: PoolTradeSideData,
  order: { side: OrderTypeStruct; lpBalance: BN; tokenDebt: BN },
  tokenPair: TokenPairProgramData
) => {
  const withdrawAmountSource =
    (lpBalance * Number(poolSide.sourceBalance)) / Number(poolSide.lpSupply);

  let withdrawAmountTarget =
    (lpBalance *
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
