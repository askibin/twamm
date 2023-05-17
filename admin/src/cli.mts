import { Command } from "commander";
import Debug from "debug";
import Client, * as clientHelpers from "./client.mts";
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
  .command("delete-test-pair")
  .description("delete test pair")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .requiredOption(
    "-r, --receiver <pubkey>",
    "User address to delete the pair for; required"
  )
  .action(
    handler(
      async (
        opts: Parameters<typeof validators.delete_test_pair_opts>[0],
        ctx: Command
      ) => {
        const { keypair, url } = ctx.optsWithGlobals();

        const client = Client(url);
        const options = validators.delete_test_pair_opts(opts);
        const signer = await readSignerKeypair(keypair);

        return methods.deleteTestPair(
          client,
          {
            options,
            arguments: {},
          },
          signer
        );
      }
    )
  );

cli
  .command("delete_test_pool")
  .description("")
  .action(
    handler(() => {
      console.error("Not implemented yet");
    })
  );

cli
  .command("get-outstanding-amount")
  .description("get outstanding amount")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .action(
    handler(
      async (
        opts: Parameters<typeof validators.get_outstanding_amount_opts>[0],
        ctx: Command
      ) => {
        const client = Client(ctx.optsWithGlobals().url);
        const options = validators.get_outstanding_amount_opts(opts);

        return methods.getOutstandingAmount(client, {
          options,
          arguments: {},
        });
      }
    )
  );

cli
  .command("init")
  .description("initialize the on-chain program")
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
  .description("initialize token-pair")
  .argument("<pubkey>", "Token A mint")
  .argument("<pubkey>", "Token B mint")
  .argument("<path>", "Path to token-pair config")
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
  .description("list multisig")
  .action(
    handler(async (options: unknown, ctx: Command) => {
      const client = Client(ctx.optsWithGlobals().url);

      return methods.listMultisig(client, { options, arguments: {} });
    })
  );

cli
  .command("list-orders")
  .description("list orders")
  .action(
    handler(async (options: unknown, ctx: Command) => {
      const client = Client(ctx.optsWithGlobals().url);

      // TODO: add filter by tokenpair or the wallet

      return methods.listOrders(client, { options, arguments: {} });
    })
  );

cli
  .command("list-pools")
  .description("list available pools")
  .action(
    handler(async (options: unknown, ctx: Command) => {
      const client = Client(ctx.optsWithGlobals().url);

      return methods.listPools(client, { options, arguments: {} });
    })
  );

cli
  .command("list-token-pairs")
  .description("list available token-pairs")
  .action(
    handler(async (opts: {}, ctx: Command) => {
      const options = opts;
      const client = Client(ctx.optsWithGlobals().url);

      return methods.listTokenPairs(client, { options, arguments: {} });
    })
  );

cli
  .command("set-admin-signers")
  .description("set admins")
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
  .description("set `crank` authority")
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
  .description("set fees")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .argument("<u64>", "Fee numerator")
  .argument("<u64>", "Fee denominator")
  .argument("<u64>", "Settle fee numerator")
  .argument("<u64>", "Settle fee denominator")
  .argument("<u64>", "Crank reward for token A")
  .argument("<u64>", "Crank reward for token B")
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
  .description("set limits")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .argument("<u64>", "Minimal swap amount for token A")
  .argument("<u64>", "Minimal swap amount for token B")
  .argument("<u64>", "Maximal swap price difference")
  .argument("<u64>", "Maximal amount of unsettled tokens")
  .argument("<u64>", "Minimal time until expiration")
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
  .description("set oracle config")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .argument("<f64>", "Maximal price error for token A")
  .argument("<f64>", "Maximal price error for token B")
  .argument("<u32>", "Maximal price age (seconds) for token A")
  .argument("<u32>", "Maximal price age (seconds) for token B")
  .argument("<string>", "Oracle type for token A")
  .argument("<string>", "Oracle type for token B")
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
  .description("set permissions")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .argument("<bool>", "Allow deposits")
  .argument("<bool>", "Allow withdrawals")
  .argument("<bool>", "Allow cranks")
  .argument("<bool>", "Allow settlements")
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
  .description("set the test oracle price")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .argument("<u64>", "Token A price")
  .argument("<u64>", "Token B price")
  .argument(
    "<i32>",
    'Expo token A; To use negative value consider using pattern: \\"-d\\"'
  )
  .argument(
    "<i32>",
    'Expo token B; To use negative value consider using pattern: \\"-d\\"'
  )
  .argument("<u64>", "Token A conf")
  .argument("<u64>", "Token B conf")
  .action(
    handler(
      async (
        priceTokenA: string,
        priceTokenB: string,
        expoTokenA: string,
        expoTokenB: string,
        confTokenA: string,
        confTokenB: string,
        opts: Parameters<typeof validators.set_test_oracle_price_opts>[0],
        ctx: Command
      ) => {
        const { keypair, url } = ctx.optsWithGlobals();
        const options = validators.set_test_oracle_price_opts(opts);
        const client = Client(url);
        const signer = await readSignerKeypair(keypair);

        const params = validators.set_test_oracle_price({
          priceTokenA,
          priceTokenB,
          expoTokenA,
          expoTokenB,
          confTokenA,
          confTokenB,
        });

        return methods.setTestOraclePrice(
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
  .command("set-test-time")
  .description("set the test time")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .argument(
    "<i64>",
    'Time; To use negative value consider using pattern: \\"-d\\"'
  )
  .action(
    handler(
      async (
        time: string,
        opts: Parameters<typeof validators.set_test_time_opts>[0],
        ctx: Command
      ) => {
        const { keypair, url } = ctx.optsWithGlobals();
        const options = validators.set_test_time_opts(opts);
        const client = Client(url);
        const signer = await readSignerKeypair(keypair);

        const params = validators.set_test_time({
          time,
        });

        return methods.setTestTime(
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
  .command("set-time-in-force")
  .description("set time in force")
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

cli
  .command("settle")
  .description("")
  .action(
    handler(() => {
      console.error("Not implemented yet");
    })
  );

cli
  .command("withdraw-fees")
  .description("withdraw fees")
  .requiredOption("-tp, --token-pair <pubkey>", "Token pair address; required")
  .requiredOption(
    "-rk, --receiver-keys <pubkey,..>",
    "Comma-separated list of receiver' public keys for A, B and SOL respectively; required"
  )
  .argument("<u64>", "Amount of token A")
  .argument("<u64>", "Amount of token B")
  .argument("<u64>", "Amount of SOL")
  .action(
    handler(
      async (
        amountTokenA: string,
        amountTokenB: string,
        amountSol: string,
        opts: Parameters<typeof validators.withdraw_fees_opts>[0],
        ctx: Command
      ) => {
        const { keypair, url } = ctx.optsWithGlobals();

        const options = validators.withdraw_fees_opts(opts);
        const client = Client(url);
        const signer = await readSignerKeypair(keypair);

        const params = validators.withdraw_fees({
          amountTokenA,
          amountTokenB,
          amountSol,
        });

        return methods.withdrawFees(
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

cli.parse();
