import * as web3 from "@solana/web3.js";
import Debug from "debug";
import { Command } from "./commands.mts";
import Client, * as cli from "./client.mts";
import { fromPublicKey } from "./utils/prepare-admin-meta.mts";

const _log = Debug("instructions");
const log = (msg: any, affix?: string) => {
  const output = affix ? _log.extend(affix) : _log;

  output(JSON.stringify(msg, null, 2));
};

export const init = async (
  client: ReturnType<typeof Client>,
  command: Command<{ minSignatures: number }, { pubkeys: web3.PublicKey[] }>
): Promise<string> => {
  const { minSignatures } = command.options;
  const { pubkeys } = command.arguments;

  const adminMetas = pubkeys.map(fromPublicKey);

  const accounts = {
    multisig: (await cli.multisig(client.program)).pda,
    systemProgram: web3.SystemProgram.programId,
    transferAuthority: (await cli.transferAuthority(client.program)).pda,
    twammProgram: client.program.programId,
    twammProgramData: (await cli.twammProgramData(client.program)).pda,
    upgradeAuthority: client.provider.wallet.publicKey,
  };

  log(accounts, "init");

  return await client.program.methods
    .init({ minSignatures })
    .accounts(accounts)
    .remainingAccounts(adminMetas)
    .rpc();
};

export const setAdminSigners = async (
  client: ReturnType<typeof Client>,
  command: Command<{ minSignatures: number }, { pubkeys: web3.PublicKey[] }>,
  signer: web3.Keypair
) => {
  const { minSignatures } = command.options;
  const { pubkeys } = command.arguments;

  const adminMetas = pubkeys.map(fromPublicKey);

  const accounts = {
    admin: signer.publicKey,
    multisig: (await cli.multisig(client.program)).pda,
    //systemProgram: web3.SystemProgram.programId,
  };

  log(accounts, "set_admin_signers");

  const multisig = await client.program.account.multisig.fetch(
    accounts.multisig
  );

  log({ multisig });

  return await client.program.methods
    .setAdminSigners({ minSignatures })
    .accounts(accounts)
    .remainingAccounts(adminMetas)
    .signers([signer])
    .rpc();
};
