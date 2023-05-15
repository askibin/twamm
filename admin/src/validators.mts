import BN from "bn.js";
import * as t from "io-ts";
import { either } from "fp-ts";
import { PublicKey } from "@solana/web3.js";

const BNType = new t.Type<BN, number, unknown>(
  "BN",
  (i): i is BN => i instanceof BN,
  (i, c) => (i instanceof BN ? t.success(i) : t.failure(i, c)),
  (i) => i.toNumber()
);

const PublicKeyType = new t.Type<PublicKey, string, unknown>(
  "PublicKey",
  (i): i is PublicKey => i instanceof PublicKey,
  (i, c) => (i instanceof PublicKey ? t.success(i) : t.failure(i, c)),
  (i) => i.toBase58()
);

const InitOpts = t.type({ minSignatures: t.number });

const TokenPair = t.type({
  allowDeposits: t.boolean,
  allowWithdrawals: t.boolean,
  allowCranks: t.boolean,
  allowSettlements: t.boolean,
  feeNumerator: t.number,
  feeDenominator: t.number,
  settleFeeNumerator: t.number,
  settleFeeDenominator: t.number,
  crankRewardTokenA: t.number,
  crankRewardTokenB: t.number,
  minSwapAmountTokenA: t.number,
  minSwapAmountTokenB: t.number,
  maxSwapPriceDiff: t.number,
  maxUnsettledAmount: t.number,
  minTimeTillExpiration: t.number,
  maxOraclePriceErrorTokenA: t.number,
  maxOraclePriceErrorTokenB: t.number,
  maxOraclePriceAgeSecTokenA: t.number,
  maxOraclePriceAgeSecTokenB: t.number,
  oracleTypeTokenA: t.object,
  oracleTypeTokenB: t.object,
  oracleAccountTokenA: t.string,
  oracleAccountTokenB: t.string,
  crankAuthority: t.string,
  timeInForceIntervals: t.array(t.number),
});

const OutTokenPair = t.union([
  TokenPair,
  t.type({
    feeDenominator: BNType,
    settleFeeNumerator: BNType,
    settleFeeDenominator: BNType,
    crankRewardTokenA: BNType,
    crankRewardTokenB: BNType,
    minSwapAmountTokenA: BNType,
    minSwapAmountTokenB: BNType,
    oracleAccountTokenA: PublicKeyType,
    oracleAccountTokenB: PublicKeyType,
    crankAuthority: PublicKeyType,
  }),
]);

const SetAdminSignersOpts = t.type({ minSignatures: t.number });

export const init = (params: { minSignatures: string }) => {
  const dOptions = InitOpts.decode({
    minSignatures: Number(params.minSignatures),
  });

  if (either.isLeft(dOptions) || isNaN(dOptions.right.minSignatures)) {
    throw new Error("Invalid minSignatures");
  }

  return dOptions.right;
};

export const set_admin_signers = (params: { minSignatures: string }) => {
  const dOptions = SetAdminSignersOpts.decode({
    minSignatures: Number(params.minSignatures),
  });

  if (either.isLeft(dOptions) || isNaN(dOptions.right.minSignatures)) {
    throw new Error("Invalid minSignatures");
  }

  return dOptions.right;
};

export const struct = {
  tokenPair: (config: {}) => {
    const dConfig = TokenPair.decode(config);

    if (either.isLeft(dConfig)) {
      throw new Error("Invalid config");
    }

    let tokenPairConfig = dConfig.right;

    /**
     * We format the data at once to keep the logic one-piece
     */
    const dConfigOut = OutTokenPair.decode({
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
