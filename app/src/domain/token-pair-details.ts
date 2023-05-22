import type { BN } from "@project-serum/anchor";
import type { TokenPair } from "@twamm/types";
import { lensPath, view } from "ramda";

import type { PairConfig, PairStats } from "../types/decl.d";

export const populateStats = (
  pair: Pick<TokenPair, "statsA" | "statsB" | "configA" | "configB">
) => {
  const decimals = lensPath(["decimals"]);
  const feesCollected = lensPath(["feesCollected"]);
  const mint = lensPath(["mint"]);
  const orderVolume = lensPath(["orderVolumeUsd"]);
  const settledVolume = lensPath(["settledVolumeUsd"]);
  const routedVolume = lensPath(["routedVolumeUsd"]);
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

  const aMint = view<PairConfig, PairConfig["mint"]>(mint, pair.configA);
  const bMint = view<PairConfig, PairConfig["mint"]>(mint, pair.configB);
  const orderVolumeValue =
    view<PairStats, BN>(orderVolume, pair.statsA).toNumber() +
    view<PairStats, BN>(orderVolume, pair.statsB).toNumber();
  const settledVolumeValue =
    view<PairStats, BN>(settledVolume, pair.statsA).toNumber() +
    view<PairStats, BN>(settledVolume, pair.statsB).toNumber();
  const routedVolumeValue =
    view<PairStats, BN>(routedVolume, pair.statsA).toNumber() +
    view<PairStats, BN>(routedVolume, pair.statsB).toNumber();

  return {
    a: aMint,
    b: bMint,
    fee,
    orderVolume: orderVolumeValue / 1e6,
    settledVolume: settledVolumeValue / 1e6,
    routedVolume: routedVolumeValue / 1e6,
  };
};
