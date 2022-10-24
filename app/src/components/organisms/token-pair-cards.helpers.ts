import type { PublicKey } from "@solana/web3.js";
import { lensPath, view } from "ramda";

export const populate = (pair: TokenPairProgramData): PerfPair => {
  const lensMint = lensPath(["mint"]);
  const lensOrderVolume = lensPath(["orderVolumeUsd"]);
  const lensSettleVolume = lensPath(["settleVolumeUsd"]);
  const lensTradeVolume = lensPath(["tradeVolumeUsd"]);

  const { feeNumerator, feeDenominator } = pair;
  const fee = feeNumerator.toNumber() / feeDenominator.toNumber();

  const aMint = view<PairConfig, PublicKey>(lensMint, pair.configA);
  const bMint = view<PairConfig, PublicKey>(lensMint, pair.configB);
  const orderVolume =
    view<PairStats, number>(lensOrderVolume, pair.statsA) +
    view<PairStats, number>(lensOrderVolume, pair.statsB);
  const settleVolume =
    view<PairStats, number>(lensSettleVolume, pair.statsA) +
    view<PairStats, number>(lensSettleVolume, pair.statsB);
  const tradeVolume =
    view<PairStats, number>(lensTradeVolume, pair.statsA) +
    view<PairStats, number>(lensTradeVolume, pair.statsB);

  return {
    aMint,
    bMint,
    fee,
    id: `${aMint}-${bMint}`,
    orderVolume,
    settleVolume,
    tradeVolume,
  };
};
