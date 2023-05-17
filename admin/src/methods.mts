import * as web3 from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import * as t from "io-ts";
import Debug from "debug";
import Client, * as cli from "./client.mts";
import * as meta from "./utils/prepare-admin-meta.mts";
import * as types from "./types.mts";
import { prettifyJSON } from "./utils/index.mts";

const _log = Debug("twamm-admin:methods");
const log = (msg: any, affix?: string) => {
  const output = affix ? _log.extend(affix) : _log;

  output(prettifyJSON(msg));
};

export type CommandInput<O, A> = {
  options: O;
  arguments: A;
};

export const getOutstandingAmount = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    t.TypeOf<typeof types.GetOutstandingAmountOpts>,
    unknown
  >
): Promise<string> => {
  log(command);

  log("Fetching token pair...");

  const pair = await client.program.account.tokenPair.fetch(
    command.options.tokenPair
  );

  const accounts = {
    tokenPair: command.options.tokenPair,
    oracleTokenA: pair.configA.oracleAccount,
    oracleTokenB: pair.configB.oracleAccount,
  };

  log(accounts, "get_outstandind_amount");

  return client.program.methods
    .getOutstandingAmount({})
    .accounts(accounts)
    .rpc();
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
    types.TokenPairType,
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

export const listMultisig = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<unknown, unknown>
) => {
  log(command);

  return client.program.account.multisig.all();
};

export const listOrders = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<unknown, unknown>
) => {
  log(command);

  return client.program.account.order.all();
};

export const listPools = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<unknown, unknown>
) => {
  log(command);

  return client.program.account.pool.all();
};

export const listTokenPairs = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<unknown, unknown>
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
  log(command);

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

export const setCrankAuthority = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    { tokenPair: web3.PublicKey },
    t.TypeOf<typeof types.SetCrankAuthorityParams>
  >,
  signer: web3.Keypair
): Promise<string> => {
  log(command);

  const accounts = {
    admin: signer.publicKey,
    multisig: (await cli.multisig(client.program)).pda,
    tokenPair: command.options.tokenPair,
  };

  log(accounts, "set_crank_authority");

  const { crankAuthority } = command.arguments;

  return client.program.methods
    .setCrankAuthority({
      crankAuthority,
    })
    .accounts(accounts)
    .signers([signer])
    .rpc();
};

export const setFees = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    { tokenPair: web3.PublicKey },
    t.TypeOf<typeof types.SetFeesParams>
  >,
  signer: web3.Keypair
): Promise<string> => {
  log(command);

  const accounts = {
    admin: signer.publicKey,
    multisig: (await cli.multisig(client.program)).pda,
    tokenPair: command.options.tokenPair,
  };

  log(accounts, "set_fees");

  return client.program.methods
    .setFees(command.arguments)
    .accounts(accounts)
    .signers([signer])
    .rpc();
};

export const setLimits = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    { tokenPair: web3.PublicKey },
    t.TypeOf<typeof types.SetLimitsParams>
  >,
  signer: web3.Keypair
): Promise<string> => {
  log(command);

  const accounts = {
    admin: signer.publicKey,
    multisig: (await cli.multisig(client.program)).pda,
    tokenPair: command.options.tokenPair,
  };

  log(accounts, "set_limits");

  return client.program.methods
    .setLimits(command.arguments)
    .accounts(accounts)
    .signers([signer])
    .rpc();
};

export const setOracleConfig = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    { tokenPair: web3.PublicKey },
    t.TypeOf<typeof types.SetOracleConfigParams>
  >,
  signer: web3.Keypair
): Promise<string> => {
  log(command);

  const accounts = {
    admin: signer.publicKey,
    multisig: (await cli.multisig(client.program)).pda,
    tokenPair: command.options.tokenPair,
  };

  log(accounts, "set_oracle_config");

  // casting object structs to satisfy anchor's `never` from Idl
  const args = command.arguments as typeof command.arguments & {
    oracleTypeTokenA: never;
    oracleTypeTokenB: never;
  };

  return client.program.methods
    .setOracleConfig(args)
    .accounts(accounts)
    .signers([signer])
    .rpc();
};

export const setPermissions = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    { tokenPair: web3.PublicKey },
    t.TypeOf<typeof types.SetPermissionsParams>
  >,
  signer: web3.Keypair
): Promise<string> => {
  log(command);

  const accounts = {
    admin: signer.publicKey,
    multisig: (await cli.multisig(client.program)).pda,
    tokenPair: command.options.tokenPair,
  };

  log(accounts, "set_permissions");

  return client.program.methods
    .setPermissions(command.arguments)
    .accounts(accounts)
    .signers([signer])
    .rpc();
};

export const setTestOraclePrice = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    t.TypeOf<typeof types.SetTestOraclePriceOpts>,
    t.TypeOf<typeof types.SetTestOraclePriceParams>
  >,
  signer: web3.Keypair
): Promise<string> => {
  log(command);

  log("Fetching token pair...");

  const pair = await client.program.account.tokenPair.fetch(
    command.options.tokenPair
  );

  const oracleAccountTokenA = pair.configA.oracleAccount;
  const oracleAccountTokenB = pair.configB.oracleAccount;

  const accounts = {
    admin: signer.publicKey,
    multisig: (await cli.multisig(client.program)).pda,
    tokenPair: command.options.tokenPair,
    oracleTokenA: oracleAccountTokenA,
    oracleTokenB: oracleAccountTokenB,
    systemProgram: web3.SystemProgram.programId,
  };

  log(accounts, "set_test_oracle_price");

  return client.program.methods
    .setTestOraclePrice(command.arguments)
    .accounts(accounts)
    .signers([signer])
    .rpc();
};

export const setTestTime = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    t.TypeOf<typeof types.SetTestTimeOpts>,
    t.TypeOf<typeof types.SetTestTimeParams>
  >,
  signer: web3.Keypair
): Promise<string> => {
  log(command);

  const accounts = {
    admin: signer.publicKey,
    multisig: (await cli.multisig(client.program)).pda,
    tokenPair: command.options.tokenPair,
  };

  log(accounts, "set_test_time");

  return client.program.methods
    .setTestTime(command.arguments)
    .accounts(accounts)
    .signers([signer])
    .rpc();
};

export const setTimeInForce = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    { tokenPair: web3.PublicKey },
    t.TypeOf<typeof types.SetTimeInForceParams>
  >,
  signer: web3.Keypair
): Promise<string> => {
  log(command);

  const accounts = {
    admin: signer.publicKey,
    multisig: (await cli.multisig(client.program)).pda,
    tokenPair: command.options.tokenPair,
  };

  log(accounts, "set_time_in_force");

  const { timeInForceIndex, newTimeInForce } = command.arguments;

  return client.program.methods
    .setTimeInForce({
      timeInForceIndex,
      newTimeInForce,
    })
    .accounts(accounts)
    .signers([signer])
    .rpc();
};

export const withdrawFees = async (
  client: ReturnType<typeof Client>,
  command: CommandInput<
    t.TypeOf<typeof types.WithdrawFeesOpts>,
    t.TypeOf<typeof types.WithdrawFeesParams>
  >,
  signer: web3.Keypair
): Promise<string> => {
  log(command);

  const authority = (await cli.transferAuthority(client.program)).pda;

  const [receiverTokenA, receiverTokenB, receiverSol] =
    command.options.receiverKeys;

  log("Fetching token pair...");

  const pair = await client.program.account.tokenPair.fetch(
    command.options.tokenPair
  );

  const tokenA = pair.configA.mint;
  const tokenB = pair.configB.mint;

  const accounts = {
    admin: signer.publicKey,
    multisig: (await cli.multisig(client.program)).pda,
    tokenPair: command.options.tokenPair,
    transferAuthority: (await cli.transferAuthority(client.program)).pda,
    custodyTokenA: await cli.tokenCustody(authority, tokenA),
    custodyTokenB: await cli.tokenCustody(authority, tokenB),
    receiverTokenA: (
      await cli.getOrCreateTokenCustody(
        client.provider.connection,
        signer,
        receiverTokenA,
        tokenA,
        false
      )
    ).address,
    receiverTokenB: (
      await cli.getOrCreateTokenCustody(
        client.provider.connection,
        signer,
        receiverTokenB,
        tokenB,
        false
      )
    ).address,
    receiverSol,
    tokenProgram: spl.TOKEN_PROGRAM_ID,
  };

  log(accounts, "withdraw_fees");

  return client.program.methods
    .withdrawFees(command.arguments)
    .accounts(accounts)
    .signers([signer])
    .rpc();
};
