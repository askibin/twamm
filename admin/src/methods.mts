import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import Debug from "debug";
import Client, * as cli from "./client.mts";
import * as meta from "./utils/prepare-admin-meta.mts";

export type CommandInput<O, A> = {
  options: O;
  arguments: A;
};

const _log = Debug("twamm-admin:methods");
const log = (msg: any, affix?: string) => {
  const output = affix ? _log.extend(affix) : _log;

  output(JSON.stringify(msg, null, 2));
};

export const init = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    { minSignatures: number },
    { pubkeys: web3.PublicKey[] }
  >
): Promise<string> => {
  const { minSignatures } = command.options;
  const { pubkeys } = command.arguments;

  const adminMetas = pubkeys.map<meta.AdminMeta>(meta.fromPublicKey);

  const accounts = {
    multisig: (await cli.multisig(client.program)).pda,
    systemProgram: web3.SystemProgram.programId,
    transferAuthority: (await cli.transferAuthority(client.program)).pda,
    twammProgram: client.program.programId,
    twammProgramData: (await cli.twammProgramData(client.program)).pda,
    upgradeAuthority: client.provider.wallet.publicKey,
  };

  log(accounts, "init");

  return client.program.methods
    .init({ minSignatures })
    .accounts(accounts)
    .remainingAccounts(adminMetas)
    .rpc();
};

export const initTokenPair = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    {
      allowDeposits: boolean;
      allowWithdrawals: boolean;
      allowCranks: boolean;
      allowSettlements: boolean;
      feeNumerator: BN;
      feeDenominator: BN;
      settleFeeNumerator: BN;
      settleFeeDenominator: BN;
      crankRewardTokenA: BN;
      crankRewardTokenB: BN;
      minSwapAmountTokenA: BN;
      minSwapAmountTokenB: BN;
      maxSwapPriceDiff: number;
      maxUnsettledAmount: number;
      minTimeTillExpiration: number;
      maxOraclePriceErrorTokenA: number;
      maxOraclePriceErrorTokenB: number;
      maxOraclePriceAgeSecTokenA: number;
      maxOraclePriceAgeSecTokenB: number;
      oracleTypeTokenA: never;
      oracleTypeTokenB: never;
      oracleAccountTokenA: web3.PublicKey;
      oracleAccountTokenB: web3.PublicKey;
      crankAuthority: web3.PublicKey;
      timeInForceIntervals: number[];
    },
    { a: web3.PublicKey; b: web3.PublicKey }
  >,
  signer: web3.Keypair
): Promise<string> => {
  log(command);

  const authority = (await cli.transferAuthority(client.program)).pda;
  const { a, b } = command.arguments;

  const accounts = {
    admin: signer.publicKey,
    multisig: (await cli.multisig(client.program)).pda,
    tokenPair: (await cli.tokenPair(client.program, a, b)).pda,
    transferAuthority: authority,
    mintTokenA: a,
    mintTokenB: b,
    custodyTokenA: await cli.tokenCustody(authority, a),
    custodyTokenB: await cli.tokenCustody(authority, b),
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
    tokenProgram: spl.TOKEN_PROGRAM_ID,
    associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
  };

  log(accounts, "init_token_pair");

  return client.program.methods
    .initTokenPair(command.options)
    .accounts(accounts)
    .signers([signer]) // FIXME: perhaps should use admin was bypassed to set_admin_signers method
    .rpc();
};

export const listTokenPairs = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<{}, {}>
) => {
  log(command);

  return client.program.account.tokenPair.all();
};

export const setAdminSigners = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    { minSignatures: number },
    { pubkeys: web3.PublicKey[] }
  >,
  signer: web3.Keypair
) => {
  const { minSignatures } = command.options;
  const { pubkeys } = command.arguments;

  const adminMetas = pubkeys.map<meta.AdminMeta>(meta.fromPublicKey);

  const accounts = {
    admin: signer.publicKey,
    multisig: (await cli.multisig(client.program)).pda,
  };

  log(accounts, "set_admin_signers");

  return client.program.methods
    .setAdminSigners({ minSignatures })
    .accounts(accounts)
    .remainingAccounts(adminMetas)
    .signers([signer])
    .rpc();
};
