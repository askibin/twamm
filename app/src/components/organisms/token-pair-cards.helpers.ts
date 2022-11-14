import type { PublicKey } from "@solana/web3.js";
import { lensPath, view } from "ramda";

export const populate = (pair: TokenPairProgramData): PerfPair => {
  const decimals = lensPath(["decimals"]);
  const feesCollected = lensPath(["feesCollected"]);
  const mint = lensPath(["mint"]);
  const orderVolume = lensPath(["orderVolumeUsd"]);
  const settleVolume = lensPath(["settleVolumeUsd"]);
  const tradeVolume = lensPath(["tradeVolumeUsd"]);
  const pendingWithdrawals = lensPath(["pendingWithdrawals"]);

  const fee =
    Number(view(feesCollected, pair.statsA)) /
      10 ** view(decimals, pair.configA) +
    Number(view(pendingWithdrawals, pair.statsB)) /
      10 ** view(decimals, pair.configB) +
    Number(view(feesCollected, pair.statsA)) /
      10 ** view(decimals, pair.configA) +
    Number(view(pendingWithdrawals, pair.statsB)) /
      10 ** view(decimals, pair.configB);

  const aMint = view<PairConfig, PublicKey>(mint, pair.configA);
  const bMint = view<PairConfig, PublicKey>(mint, pair.configB);
  const orderVolumeValue =
    view<PairStats, number>(orderVolume, pair.statsA) +
    view<PairStats, number>(orderVolume, pair.statsB);
  const settleVolumeValue =
    view<PairStats, number>(settleVolume, pair.statsA) +
    view<PairStats, number>(settleVolume, pair.statsB);
  const tradeVolumeValue =
    view<PairStats, number>(tradeVolume, pair.statsA) +
    view<PairStats, number>(tradeVolume, pair.statsB);

  return {
    aMint,
    bMint,
    fee,
    id: `${aMint}-${bMint}`,
    orderVolume: orderVolumeValue,
    settleVolume: settleVolumeValue,
    tradeVolume: tradeVolumeValue,
  };
};
