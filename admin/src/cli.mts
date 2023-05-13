import { Command } from "commander";
import * as commands from "./commands.mts";
import resolveWalletPath from "./utils/resolve-wallet-path.mjs";

const VERSION = "0.1.0";

function handler(command: any, parser?: any) {
  return (args: string[], options: {}, cli: Command) => {
    const res = command(args, options, cli);

    return parser ? parser(res) : res;
    // allow to pass the result as is
  };
}

let cli = new Command()
  .name("twamm-admin")
  .description(
    `Welcome to twamm admin. Use the "help" command to get more information.`
  )
  .requiredOption("-k, --keypair <path>", "path to the payer's keypair")
  .option("-u, --url <string>", "cluster address; supports monikers", "devnet")
  .version(VERSION);

/**
 * Read the global options and fill the `ANCHOR_WALLET`
 * env variable with the path to the anchor wallet.
 */
cli.hook("preSubcommand", (cmd, subCmd) => {
  const { keypair } = cmd.optsWithGlobals();
  const ANCHOR_WALLET = resolveWalletPath(keypair);

  Object.assign(process.env, { ANCHOR_WALLET });
});

cli
  .command("cancel-withdrawals")
  .description("")
  .action(handler(commands.cancel_withdrawals));

cli
  .command("delete-test-pair")
  .description("")
  .action(handler(commands.delete_test_pair));

cli
  .command("delete_test_pool")
  .description("")
  .action(handler(commands.delete_test_pool));

cli
  .command("get-outstanding-amount")
  .description("")
  .action(handler(commands.get_outstanding_amount));

cli
  .command("cancel-withdrawals")
  .description("")
  .action(handler(commands.cancel_withdrawals));

cli
  .command("init")
  .description("Initialize the on-chain program")
  .option("-m, --min-signatures <u8>", "Minimum number of signatures", "1")
  .argument("<pubkeys...>", "List of signer keys")
  .action(handler(commands.init));

cli
  .command("init-token-pair")
  .description("Init token pair")
  .action(handler(commands.init_token_pair));

cli
  .command("list-multisig")
  .description("")
  .action(handler(commands.list_multisig));

cli
  .command("list-orders")
  .description("")
  .action(handler(commands.list_orders));

cli.command("list-pools").description("").action(handler(commands.list_pools));

cli
  .command("list-token-pairs")
  .description("")
  .action(handler(commands.list_token_pairs));

cli
  .command("set-admin-signers")
  .description("Set admins")
  .option("-m, --min-signatures <u8>", "Minimum number of signatures", "1")
  .argument("<pubkeys...>", "List of signer keys")
  .action(handler(commands.set_admin_signers));

cli
  .command("set_crank_authority")
  .description("")
  .action(handler(commands.set_crank_authority));

cli.command("set-fees").description("").action(handler(commands.set_fees));

cli.command("set-limits").description("").action(handler(commands.set_limits));

cli
  .command("set_oracle_config")
  .description("")
  .action(handler(commands.set_oracle_config));

cli
  .command("set-permissions")
  .description("")
  .action(handler(commands.set_permissions));

cli
  .command("set-test-oracle-price")
  .description("")
  .action(handler(commands.set_test_oracle_price));

cli
  .command("set-test-time")
  .description("")
  .action(handler(commands.set_test_time));

cli
  .command("set-time-in-force")
  .description("")
  .action(handler(commands.set_time_in_force));

cli.command("settle").description("").action(handler(commands.settle));

cli
  .command("withdraw-fees")
  .description("")
  .action(handler(commands.withdraw_fees));

cli.parse();
