import * as t from "io-ts";
import BN from "bn.js";
import { either } from "fp-ts";
import { PublicKey } from "@solana/web3.js";
import * as types from "./types.mts";

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

export const set_crank_authority_opts = (params: { tokenPair: string }) => {
  const dOptions = types.SetCrankAuthorityOpts.decode({
    tokenPair: new PublicKey(params.tokenPair),
  });

  if (either.isLeft(dOptions)) {
    throw new Error("Invalid options");
  }

  return dOptions.right;
};

export const set_crank_authority = (params: { pubkey: string }) => {
  const dParams = types.SetCrankAuthorityParams.decode({
    crankAuthority: new PublicKey(params.pubkey),
  });

  if (either.isLeft(dParams)) {
    throw new Error("Invalid SetCrankAuthority params");
  }

  return dParams.right;
};

export const set_fees_opts = (params: { tokenPair: string }) => {
  const dOptions = types.SetFeesOpts.decode({
    tokenPair: new PublicKey(params.tokenPair),
  });

  if (either.isLeft(dOptions)) {
    throw new Error("Invalid options");
  }

  return dOptions.right;
};

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

export const set_time_in_force_opts = (params: { tokenPair: string }) => {
  const dOptions = types.SetTimeInForceOpts.decode({
    tokenPair: new PublicKey(params.tokenPair),
  });

  if (either.isLeft(dOptions)) {
    throw new Error("Invalid options");
  }

  return dOptions.right;
};

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
