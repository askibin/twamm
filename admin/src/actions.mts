import * as web3 from "@solana/web3.js";
import { Command } from "./commands.mts";
import Client, * as cli from "./client.mts";
import { fromPublicKey } from "./utils/prepare-admin-meta.mts";
import readSignerKeypair from "./utils/read-signer-keypair.mts";

export const init = async (
  client: ReturnType<typeof Client>,
  command: Command<{ minSignatures: number }, { pubkeys: web3.PublicKey[] }>
) => {
  const { minSignatures } = command.options;
  const { pubkeys } = command.arguments;

  const adminMetas = pubkeys.map(fromPublicKey);

  const accounts = {
    multisig: (await cli.multisig(client.program)).pda,
    systemProgram: web3.SystemProgram.programId,
    transferAuthority: (await cli.transferAuthority(client.program)).pda,
    twammProgram: client.program.programId,
    twammProgramData: (await cli.twammProgramData(client.program)).pda,
    _twammProgramData: (await cli.twammProgramData(client.program)).pda,
    upgradeAuthority: client.provider.wallet.publicKey,
  };

  console.log(accounts);

  const result = await client.program.methods
    .init({ minSignatures })
    .accounts(accounts)
    .remainingAccounts(adminMetas)
    .rpc();

  console.log("|>", result);
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

  console.log(accounts);

  const multisig = await client.program.account.multisig.fetch(accounts.multisig);

  console.log({ multisig })

  const result = await client.program.methods
    .setAdminSigners({ minSignatures })
    .accounts(accounts)
    .remainingAccounts(adminMetas)
    .signers([signer])
    .rpc();

  console.log("|>", result);
};
