import * as web3 from "@solana/web3.js";
import Debug from "debug";
import Client, * as cli from "./client.mts";
import * as meta from "./utils/prepare-admin-meta.mts";

export type CommandInput<O, A> = {
  options: O;
  arguments: A;
};

const _log = Debug("instructions");
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
    //systemProgram: web3.SystemProgram.programId,
  };

  log(accounts, "set_admin_signers");

  return client.program.methods
    .setAdminSigners({ minSignatures })
    .accounts(accounts)
    .remainingAccounts(adminMetas)
    .signers([signer])
    .rpc();
};
