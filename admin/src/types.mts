import BN from "bn.js";
import * as t from "io-ts";
import { PublicKey } from "@solana/web3.js";

export const BNType = new t.Type<BN, number, unknown>(
  "BN",
  (i): i is BN => i instanceof BN,
  (i, c) => (i instanceof BN ? t.success(i) : t.failure(i, c)),
  (i) => i.toNumber()
);

export const PublicKeyType = new t.Type<PublicKey, string, unknown>(
  "PublicKey",
  (i): i is PublicKey => i instanceof PublicKey,
  (i, c) => (i instanceof PublicKey ? t.success(i) : t.failure(i, c)),
  (i) => i.toBase58()
);

export const TokenPairOpts = t.type({
  tokenPair: PublicKeyType,
});

/**
 * Get outstanding amount
 */

export const GetOutstandingAmountOpts = TokenPairOpts;

/**
 * Initialize
 */

export const InitOpts = t.type({ minSignatures: t.number });

/**
 * Set admin signers
 */

export const SetAdminSignersOpts = t.type({ minSignatures: t.number });

/**
 * Set crank authority
 */

export const SetCrankAuthorityParams = t.type({
  crankAuthority: PublicKeyType,
});

export const SetCrankAuthorityOpts = TokenPairOpts;

/**
 * Set fees
 */

export const FeeParamsRaw = t.type({
  feeNumerator: t.string,
  feeDenominator: t.string,
  settleFeeNumerator: t.string,
  settleFeeDenominator: t.string,
  crankRewardTokenA: t.string,
  crankRewardTokenB: t.string,
});

export const SetFeesParams = t.type({
  feeNumerator: BNType,
  feeDenominator: BNType,
  settleFeeNumerator: BNType,
  settleFeeDenominator: BNType,
  crankRewardTokenA: BNType,
  crankRewardTokenB: BNType,
});

export const SetFeesOpts = TokenPairOpts;

/**
 * Set limits
 */

export const LimitsParams = t.type({
  minSwapAmountTokenA: t.string,
  minSwapAmountTokenB: t.string,
  maxSwapPriceDiff: t.string,
  maxUnsettledAmount: t.string,
  minTimeTillExpiration: t.string,
});

export const SetLimitsParams = t.type({
  minSwapAmountTokenA: BNType,
  minSwapAmountTokenB: BNType,
  maxSwapPriceDiff: t.number,
  maxUnsettledAmount: t.number,
  minTimeTillExpiration: t.number,
});

export const SetLimitsOpts = TokenPairOpts;

/**
 * Set oracle config
 */

export const OracleConfigParams = t.type({
  maxOraclePriceErrorTokenA: t.string,
  maxOraclePriceErrorTokenB: t.string,
  maxOraclePriceAgeSecTokenA: t.string,
  maxOraclePriceAgeSecTokenB: t.string,
  oracleTypeTokenA: t.string,
  oracleTypeTokenB: t.string,
  oracleAccountTokenA: t.string,
  oracleAccountTokenB: t.string,
});

export const SetOracleConfigParams = t.type({
  maxOraclePriceErrorTokenA: t.number,
  maxOraclePriceErrorTokenB: t.number,
  maxOraclePriceAgeSecTokenA: t.number,
  maxOraclePriceAgeSecTokenB: t.number,
  oracleTypeTokenA: t.object,
  oracleTypeTokenB: t.object,
  oracleAccountTokenA: PublicKeyType,
  oracleAccountTokenB: PublicKeyType,
});

export const SetOracleConfigOpts = TokenPairOpts;

/**
 *  Set permissions
 */

export const PermissionsParams = t.type({
  allowDeposits: t.string,
  allowWithdrawals: t.string,
  allowCranks: t.string,
  allowSettlements: t.string,
});

export const SetPermissionsParams = t.type({
  allowDeposits: t.boolean,
  allowWithdrawals: t.boolean,
  allowCranks: t.boolean,
  allowSettlements: t.boolean,
});

export const SetPermissionsOpts = TokenPairOpts;

/**
 * Set test time
 */

export const TestTimeParams = t.type({
  time: t.string,
});

export const SetTestTimeParams = t.type({
  time: BNType,
});

export const SetTestTimeOpts = TokenPairOpts

/**
 *  Set time in force
 */

export const SetTimeInForceParams = t.type({
  timeInForceIndex: t.number,
  newTimeInForce: t.number,
});

export const SetTimeInForceOpts = TokenPairOpts;

/**
 * Withdraw fees
 */

export const FeesParams = t.type({
  amountTokenA: t.string,
  amountTokenB: t.string,
  amountSol: t.string,
});

export const WithdrawFeesParams = t.type({
  amountTokenA: BNType,
  amountTokenB: BNType,
  amountSol: BNType,
});

export const WithdrawFeesOpts = t.type({
  tokenPair: PublicKeyType,
  receiverKeys: t.readonlyArray(PublicKeyType),
});

// end

export const TokenPairRaw = t.type({
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

/**
 * Init token pair
 */

export const TokenPair = t.type({
  allowDeposits: t.boolean,
  allowWithdrawals: t.boolean,
  allowCranks: t.boolean,
  allowSettlements: t.boolean,
  feeNumerator: BNType,
  feeDenominator: BNType,
  settleFeeNumerator: BNType,
  settleFeeDenominator: BNType,
  crankRewardTokenA: BNType,
  crankRewardTokenB: BNType,
  minSwapAmountTokenA: BNType,
  minSwapAmountTokenB: BNType,
  maxSwapPriceDiff: t.number,
  maxUnsettledAmount: t.number,
  minTimeTillExpiration: t.number,
  maxOraclePriceErrorTokenA: t.number,
  maxOraclePriceErrorTokenB: t.number,
  maxOraclePriceAgeSecTokenA: t.number,
  maxOraclePriceAgeSecTokenB: t.number,
  oracleTypeTokenA: t.object,
  oracleTypeTokenB: t.object,
  oracleAccountTokenA: PublicKeyType,
  oracleAccountTokenB: PublicKeyType,
  crankAuthority: PublicKeyType,
  timeInForceIntervals: t.array(t.number),
});

// casting object structs to satisfy anchor's `never` from Idl
export type TokenPairType = t.TypeOf<typeof TokenPair> & {
  oracleTypeTokenA: never;
  oracleTypeTokenB: never;
};
