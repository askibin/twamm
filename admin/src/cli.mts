import { Command } from "commander";
import Debug from "debug";
import Client, * as clientHelpers from "./client.mts";
import * as commands from "./commands.mts";
import * as methods from "./methods.mts";
import * as validators from "./validators.mts";
import readSignerKeypair from "./utils/read-signer-keypair.mts";
import resolveWalletPath from "./utils/resolve-wallet-path.mjs";
import { readJSON } from "./utils/read-file-content.mts";
import { populateSigners, prettifyJSON } from "./utils/index.mts";

const VERSION = "0.1.0";

const log = Debug("twamm-admin:cli");

function handler(command: any, parser: any = prettifyJSON) {
  return async (...args: any[]) => {
    const res = await command(...args);
    const out = parser ? await parser(res) : res;

    console.log(out); // show the result via `console`
  };
}

let cli = new Command()
  .name("twamm-admin")
  .description(
    `Welcome to twamm admin. Use the "help" command to get more information.`
  )
  .requiredOption(
    "-k, --keypair <path>",
    "path to the payer's keypair; required"
  )
  .option("-u, --url <string>", "cluster address; supports monikers", "devnet")
  .version(VERSION);

/**
 * Read the global options and fill the `ANCHOR_WALLET`
 * env variable with the path to the anchor wallet.
 */
cli.hook("preSubcommand", (cmd, subCmd) => {
  const { keypair } = cmd.optsWithGlobals();

  if (!keypair) return;

  const ANCHOR_WALLET = resolveWalletPath(keypair);

  Object.assign(process.env, { ANCHOR_WALLET });

  log("`ANCHOR_WALLET` env was set to:", ANCHOR_WALLET);
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
  .action(
    handler(
      (
        args: string[],
        opts: Parameters<typeof validators.init>[0],
        ctx: Command
      ) => {
        const options = validators.init(opts);
        const pubkeys = populateSigners(args);
        const client = Client(ctx.optsWithGlobals().url);

        return methods.init(client, { options, arguments: { pubkeys } });
      }
    )
  );

cli
  .command("init-token-pair")
  .description("Initialize token-pair")
  .argument("<a-mint-pubkey>", "Token A mint")
  .argument("<b-mint-pubkey>", "Token B mint")
  .argument("<path-to-token-pair-config>", "Path to token-pair config")
  .action(
    handler(
      async (
        a: string,
        b: string,
        configFile: string,
        _: never,
        ctx: Command
      ) => {
        const { keypair } = ctx.optsWithGlobals();

        const client = Client(ctx.optsWithGlobals().url);
        const mints = populateSigners([a, b]);
        const signer = await readSignerKeypair(keypair);

        let tokenPairConfig = await readJSON(configFile);
        tokenPairConfig = await validators.struct.tokenPair(tokenPairConfig);
        return methods.initTokenPair(
          client,
          {
            options: tokenPairConfig,
            arguments: {
              a: mints[0],
              b: mints[1],
            },
          },
          signer
        );
      }
    )
  );

cli
  .command("list-multisig")
  .description("")
  .action(handler(commands.list_multisig));

cli
  .command("list-orders")
  .description("")
  .action(
    handler(async (options: unknown, ctx: Command) => {
      const client = Client(ctx.optsWithGlobals().url);

      return methods.listOrders(client, { options, arguments: {} });
    })
  );

cli
  .command("list-pools")
  .description("List available pools")
  .action(
    handler(async (options: unknown, ctx: Command) => {
      const client = Client(ctx.optsWithGlobals().url);

      return methods.listPools(client, { options, arguments: {} });
    })
  );

cli
  .command("list-token-pairs")
  .description("List available token-pairs")
  .action(
    handler(async (opts: {}, ctx: Command) => {
      const options = opts;
      const client = Client(ctx.optsWithGlobals().url);

      return methods.listTokenPairs(client, { options, arguments: {} });
    })
  );

cli
  .command("set-admin-signers")
  .description("Set admins")
  .option("-m, --min-signatures <u8>", "Minimum number of signatures", "1")
  .argument("<pubkeys...>", "List of signer keys")
  .action(
    handler(
      async (
        args: string[],
        opts: Parameters<typeof validators.set_admin_signers>[0],
        ctx: Command
      ) => {
        const { keypair, url } = ctx.optsWithGlobals();

        const options = validators.set_admin_signers(opts);
        const pubkeys = populateSigners(args);
        const client = Client(url);
        const signer = await readSignerKeypair(keypair);

        return methods.setAdminSigners(
          client,
          {
            options,
            arguments: { pubkeys },
          },
          signer
        );
      }
    )
  );

cli
  .command("set-crank-authority")
  .description("Set `crank` authority")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .argument("<pubkey>", "Crank authority pubkey")
  .action(
    handler(
      async (
        pubkey: string,
        opts: Parameters<typeof validators.set_crank_authority_opts>[0],
        ctx: Command
      ) => {
        const { keypair, url } = ctx.optsWithGlobals();

        const options = validators.set_crank_authority_opts(opts);
        const client = Client(url);
        const signer = await readSignerKeypair(keypair);

        const { crankAuthority } = validators.set_crank_authority({
          pubkey,
        });

        return methods.setCrankAuthority(
          client,
          {
            options,
            arguments: { crankAuthority },
          },
          signer
        );
      }
    )
  );

cli
  .command("set-fees")
  .description("Set fees")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .argument("<fee-numerator-u64>", "Fee numerator")
  .argument("<fee-denominator-u64>", "Fee denominator")
  .argument("<settle-fee-numerator-u64>", "Settle fee numerator")
  .argument("<settle-fee-denominator-u64>", "Settle fee denominator")
  .argument("<crank-reward-token-a-u64>", "Crank reward for A")
  .argument("<crank-reward-token-b-u64>", "Crank reward for B")
  .action(
    handler(
      async (
        feeNumerator: string,
        feeDenominator: string,
        settleFeeNumerator: string,
        settleFeeDenominator: string,
        crankRewardTokenA: string,
        crankRewardTokenB: string,
        opts: Parameters<typeof validators.set_fees_opts>[0],
        ctx: Command
      ) => {
        const { keypair, url } = ctx.optsWithGlobals();

        const options = validators.set_fees_opts(opts);
        const client = Client(url);
        const signer = await readSignerKeypair(keypair);

        const params = validators.set_fees({
          feeNumerator,
          feeDenominator,
          settleFeeNumerator,
          settleFeeDenominator,
          crankRewardTokenA,
          crankRewardTokenB,
        });

        return methods.setFees(
          client,
          {
            options,
            arguments: params,
          },
          signer
        );
      }
    )
  );

cli
  .command("set-limits")
  .description("Set limits")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .argument("<min-swap-amount-token-a-u64>", "Minimal swap amount for token A")
  .argument("<min-swap-amount-token-b-u64>", "Minimal swap amount for token B")
  .argument("<max-swap-price-diff-u64>", "Maximal swap price difference")
  .argument("<max-unsettled-amount-u64>", "Maximal amount of unsettled tokens")
  .argument("<min-time-till-expiration-u64>", "Minimal time until expiration")
  .action(
    handler(
      async (
        minSwapAmountTokenA: string,
        minSwapAmountTokenB: string,
        maxSwapPriceDiff: string,
        maxUnsettledAmount: string,
        minTimeTillExpiration: string,
        opts: Parameters<typeof validators.set_limits_opts>[0],
        ctx: Command
      ) => {
        const { keypair, url } = ctx.optsWithGlobals();

        const options = validators.set_limits_opts(opts);
        const client = Client(url);
        const signer = await readSignerKeypair(keypair);

        const params = validators.set_limits({
          minSwapAmountTokenA,
          minSwapAmountTokenB,
          maxSwapPriceDiff,
          maxUnsettledAmount,
          minTimeTillExpiration,
        });

        return methods.setLimits(
          client,
          {
            options,
            arguments: params,
          },
          signer
        );
      }
    )
  );
cli
  .command("set-oracle-config")
  .description("Set oracle config")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .argument("<max-price-error-token-a-f64>", "Max price error for A")
  .argument("<max-price-error-token-b-f64>", "Max price error for B")
  .argument(
    "<max-oracle-price-age-sec-token-a-u32>",
    "Max price agein seconds for A"
  )
  .argument(
    "<max-oracle-price-age-sec-token-b-u32>",
    "Max price age in seconds for B"
  )
  .argument("<oracle-type-token-a>", "Oracle type for A")
  .argument("<oracle-type-token-b>", "Oracle type for B")
  .action(
    handler(
      async (
        maxOraclePriceErrorTokenA: string,
        maxOraclePriceErrorTokenB: string,
        maxOraclePriceAgeSecTokenA: string,
        maxOraclePriceAgeSecTokenB: string,
        oracleTypeTokenA: string,
        oracleTypeTokenB: string,
        opts: Parameters<typeof validators.set_oracle_config_opts>[0],
        ctx: Command
      ) => {
        const { keypair, url } = ctx.optsWithGlobals();

        const options = validators.set_oracle_config_opts(opts);
        const client = Client(url);
        const signer = await readSignerKeypair(keypair);

        log("Fetching token pair...");

        const pair = await client.program.account.tokenPair.fetch(
          options.tokenPair
        );

        const tokenA = pair.configA.mint;
        const tokenB = pair.configB.mint;

        const oracleAccountTokenA = (
          await clientHelpers.oracleTokenA(client.program, tokenA, tokenB)
        ).pda.toBase58();
        const oracleAccountTokenB = (
          await clientHelpers.oracleTokenB(client.program, tokenA, tokenB)
        ).pda.toBase58();

        const params = validators.set_oracle_config({
          maxOraclePriceErrorTokenA,
          maxOraclePriceErrorTokenB,
          maxOraclePriceAgeSecTokenA,
          maxOraclePriceAgeSecTokenB,
          oracleTypeTokenA,
          oracleTypeTokenB,
          oracleAccountTokenA,
          oracleAccountTokenB,
        });

        return methods.setOracleConfig(
          client,
          {
            options,
            arguments: params,
          },
          signer
        );
      }
    )
  );

cli
  .command("set-permissions")
  .description("Set permissions")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .argument("<allow-deposits-bool>", "Allow deposits")
  .argument("<allow-withdrawals-bool>", "Allow withdrawals")
  .argument("<allow-cranks-bool>", "Allow cranks")
  .argument("<allow-settlements-bool>", "Allow settlements")
  .action(
    handler(
      async (
        allowDeposits: string,
        allowWithdrawals: string,
        allowCranks: string,
        allowSettlements: string,
        opts: Parameters<typeof validators.set_permissions_opts>[0],
        ctx: Command
      ) => {
        const { keypair, url } = ctx.optsWithGlobals();

        const options = validators.set_permissions_opts(opts);
        const client = Client(url);
        const signer = await readSignerKeypair(keypair);

        const params = validators.set_permissions({
          allowDeposits,
          allowWithdrawals,
          allowCranks,
          allowSettlements,
        });

        return methods.setPermissions(
          client,
          {
            options,
            arguments: params,
          },
          signer
        );
      }
    )
  );

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
  .description("Set time in force")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .argument("<u8>", "Time in force index")
  .argument("<u32>", "New time in force")
  .action(
    handler(
      async (
        tifIndex: string,
        tif: string,
        opts: Parameters<typeof validators.set_time_in_force_opts>[0],
        ctx: Command
      ) => {
        const { keypair, url } = ctx.optsWithGlobals();
        const options = validators.set_time_in_force_opts(opts);
        const client = Client(url);
        const signer = await readSignerKeypair(keypair);

        const { timeInForceIndex, newTimeInForce } =
          validators.set_time_in_force({
            tifIndex,
            tif,
          });

        return methods.setTimeInForce(
          client,
          {
            options,
            arguments: {
              timeInForceIndex,
              newTimeInForce,
            },
          },
          signer
        );
      }
    )
  );

cli.command("settle").description("").action(handler(commands.settle));

cli
  .command("withdraw-fees")
  .description("")
  .action(handler(commands.withdraw_fees));

cli.parse();
