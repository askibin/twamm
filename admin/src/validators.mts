import * as t from "io-ts";
import BN from "bn.js";
import { either } from "fp-ts";
import { PublicKey } from "@solana/web3.js";
import * as types from "./types.mts";
import { populateSigners } from "./utils/index.mts";

const token_pair_opts = (
  params: { tokenPair: string },
  scheme = types.TokenPairOpts
) => {
  const dOptions = scheme.decode({
    tokenPair: new PublicKey(params.tokenPair),
  });

  if (either.isLeft(dOptions)) {
    throw new Error("Invalid options");
  }

  return dOptions.right;
};

export const init = (params: { minSignatures: string }) => {
  const dOptions = types.InitOpts.decode({
    minSignatures: Number(params.minSignatures),
  });

  if (either.isLeft(dOptions) || isNaN(dOptions.right.minSignatures)) {
    throw new Error("Invalid minSignatures");
  }

  return dOptions.right;
};

export const set_admin_signers = (params: { minSignatures: string }) => {
  const dOptions = types.SetAdminSignersOpts.decode({
    minSignatures: Number(params.minSignatures),
  });

  if (either.isLeft(dOptions) || isNaN(dOptions.right.minSignatures)) {
    throw new Error("Invalid minSignatures");
  }

  return dOptions.right;
};

export const set_crank_authority_opts = (p: { tokenPair: string }) =>
  token_pair_opts(p, types.SetCrankAuthorityOpts);

export const set_crank_authority = (params: { pubkey: string }) => {
  const dParams = types.SetCrankAuthorityParams.decode({
    crankAuthority: new PublicKey(params.pubkey),
  });

  if (either.isLeft(dParams)) {
    throw new Error("Invalid SetCrankAuthority params");
  }

  return dParams.right;
};

export const set_fees_opts = (p: { tokenPair: string }) =>
  token_pair_opts(p, types.SetFeesOpts);

export const set_fees = (params: t.TypeOf<typeof types.FeeParamsRaw>) => {
  const dParamsRaw = types.FeeParamsRaw.decode(params);

  if (either.isLeft(dParamsRaw)) {
    throw new Error("Invalid params");
  }

  const dParams = types.SetFeesParams.decode({
    feeNumerator: new BN(params.feeNumerator),
    feeDenominator: new BN(params.feeDenominator),
    settleFeeNumerator: new BN(params.settleFeeNumerator),
    settleFeeDenominator: new BN(params.settleFeeDenominator),
    crankRewardTokenA: new BN(params.crankRewardTokenA),
    crankRewardTokenB: new BN(params.crankRewardTokenB),
  });

  if (either.isLeft(dParams)) {
    throw new Error("Invalid SetFees params");
  }

  return dParams.right;
};

export const set_limits_opts = (p: { tokenPair: string }) =>
  token_pair_opts(p, types.SetLimitsOpts);

export const set_limits = (params: t.TypeOf<typeof types.LimitsParams>) => {
  const dParams = types.SetLimitsParams.decode({
    minSwapAmountTokenA: new BN(params.minSwapAmountTokenA),
    minSwapAmountTokenB: new BN(params.minSwapAmountTokenB),
    maxSwapPriceDiff: Number(params.maxSwapPriceDiff),
    maxUnsettledAmount: Number(params.maxUnsettledAmount),
    minTimeTillExpiration: Number(params.minTimeTillExpiration),
  });

  if (
    either.isLeft(dParams) ||
    isNaN(dParams.right.maxSwapPriceDiff) ||
    isNaN(dParams.right.maxUnsettledAmount) ||
    isNaN(dParams.right.minTimeTillExpiration)
  ) {
    throw new Error("Invalid SetLimits params");
  }

  return dParams.right;
};

export const set_oracle_config_opts = (p: { tokenPair: string }) =>
  token_pair_opts(p, types.SetOracleConfigOpts);

export const set_oracle_config = (
  params: t.TypeOf<typeof types.OracleConfigParams>
) => {
  const dParams = types.SetOracleConfigParams.decode({
    maxOraclePriceErrorTokenA: Number(params.maxOraclePriceErrorTokenA),
    maxOraclePriceErrorTokenB: Number(params.maxOraclePriceErrorTokenB),
    maxOraclePriceAgeSecTokenA: Number(params.maxOraclePriceAgeSecTokenA),
    maxOraclePriceAgeSecTokenB: Number(params.maxOraclePriceAgeSecTokenB),
    oracleTypeTokenA: JSON.parse(params.oracleTypeTokenA),
    oracleTypeTokenB: JSON.parse(params.oracleTypeTokenB),
    oracleAccountTokenA: new PublicKey(params.oracleAccountTokenA),
    oracleAccountTokenB: new PublicKey(params.oracleAccountTokenB),
  });

  if (
    either.isLeft(dParams) ||
    isNaN(dParams.right.maxOraclePriceErrorTokenA) ||
    isNaN(dParams.right.maxOraclePriceErrorTokenB) ||
    isNaN(dParams.right.maxOraclePriceAgeSecTokenA) ||
    isNaN(dParams.right.maxOraclePriceAgeSecTokenB)
  ) {
    throw new Error("Invalid SetOracleConfig params");
  }

  return dParams.right;
};

export const set_permissions_opts = (p: { tokenPair: string }) =>
  token_pair_opts(p, types.SetPermissionsOpts);

export const set_permissions = (
  params: t.TypeOf<typeof types.PermissionsParams>
) => {
  const dParams = types.SetPermissionsParams.decode({
    allowDeposits: params.allowDeposits === "true",
    allowWithdrawals: params.allowWithdrawals === "true",
    allowCranks: params.allowCranks === "true",
    allowSettlements: params.allowSettlements === "true",
  });

  if (either.isLeft(dParams)) {
    throw new Error("Invalid SetPermissions params");
  }

  return dParams.right;
};

export const set_time_in_force = (params: {
  tifIndex: string;
  tif: string;
}) => {
  const dParams = types.SetTimeInForceParams.decode({
    timeInForceIndex: Number(params.tifIndex),
    newTimeInForce: Number(params.tif),
  });

  if (
    either.isLeft(dParams) ||
    isNaN(dParams.right.timeInForceIndex) ||
    isNaN(dParams.right.newTimeInForce)
  ) {
    throw new Error("Invalid SetTimeInForce params");
  }

  return dParams.right;
};

export const set_time_in_force_opts = (p: { tokenPair: string }) =>
  token_pair_opts(p, types.SetTimeInForceOpts);

/// Withdraw fees

export const withdraw_fees_opts = (params: {
  tokenPair: string;
  receiverKeys: string;
}) => {
  const addrs = params.receiverKeys.split(",");
  let receiverKeys;
  if (addrs.length === 1) {
    receiverKeys = new Array(3).fill(addrs[0]);
  } else if (addrs.length !== 3) {
    throw new Error(
      "Wrong number of receiver keys; it should be equal to 1 or 3"
    );
  } else {
    receiverKeys = addrs;
  }

  const dOptions = types.WithdrawFeesOpts.decode({
    tokenPair: new PublicKey(params.tokenPair),
    receiverKeys: populateSigners(receiverKeys),
  });

  if (either.isLeft(dOptions)) {
    throw new Error("Invalid options");
  }

  return dOptions.right;
};

export const withdraw_fees = (params: t.TypeOf<typeof types.FeesParams>) => {
  const dParams = types.WithdrawFeesParams.decode({
    amountTokenA: new BN(params.amountTokenA),
    amountTokenB: new BN(params.amountTokenB),
    amountSol: new BN(params.amountSol),
  });

  if (either.isLeft(dParams)) {
    throw new Error("Invalid WithdrawFees params");
  }

  return dParams.right;
};

// end of method validators

export const struct = {
  tokenPair: (config: {}) => {
    const dConfig = types.TokenPairRaw.decode(config);

    if (either.isLeft(dConfig)) {
      throw new Error("Invalid config");
    }

    let tokenPairConfig = dConfig.right;

    /**
     * We format the data at once to keep the logic one-piece
     */
    const dConfigOut = types.TokenPair.decode({
      ...tokenPairConfig,
      feeNumerator: new BN(tokenPairConfig.feeNumerator),
      feeDenominator: new BN(tokenPairConfig.feeDenominator),
      settleFeeNumerator: new BN(tokenPairConfig.settleFeeNumerator),
      settleFeeDenominator: new BN(tokenPairConfig.settleFeeDenominator),
      crankRewardTokenA: new BN(tokenPairConfig.crankRewardTokenA),
      crankRewardTokenB: new BN(tokenPairConfig.crankRewardTokenB),
      minSwapAmountTokenA: new BN(tokenPairConfig.minSwapAmountTokenA),
      minSwapAmountTokenB: new BN(tokenPairConfig.minSwapAmountTokenB),
      oracleAccountTokenA: new PublicKey(tokenPairConfig.oracleAccountTokenA),
      oracleAccountTokenB: new PublicKey(tokenPairConfig.oracleAccountTokenB),
      crankAuthority: new PublicKey(tokenPairConfig.crankAuthority),
    });

    if (either.isLeft(dConfigOut)) {
      throw new Error("Invalid TokenPair config");
    }

    return dConfigOut.right;
  },
};
