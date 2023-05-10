import * as t from "io-ts";
import * as web3 from "@solana/web3.js";
import { Command as Program } from "commander";
import { either as Either } from "fp-ts";
import * as actions from "./actions.mts";
import Client, { ClusterMoniker } from "./client.mts";
import resolveWalletPath from "./utils/resolve-wallet-path.mts";

export type Command<O, A> = {
  options: O;
  arguments: A;
};

const populateSigners = (signers: string[]) =>
  signers.map((signer) => new web3.PublicKey(signer));

/**
 * Read the global options and fill the `ANCHOR_WALLET`
 * env variable with the path to the anchor wallet.
 */
const populateOptions = (
  cli: Program
): { programId: string; url: ClusterMoniker } => {
  const { keypair, programId, url } = cli.optsWithGlobals();

  Object.assign(process.env, { ANCHOR_WALLET: resolveWalletPath(keypair) });

  return { programId, url };
};

/**
 * Cancel withdrawal orders
 */
export const cancel_withdrawals = () => {};

/**
 * Delete test pair
 */
export const delete_test_pair = () => {};

/**
 * Delete test pool
 */
export const delete_test_pool = () => {};

/**
 * Get outstanding amount
 */
export const get_outstanding_amount = () => {};

/**
 * Initialize the on-chain program
 */
export const init = async (
  args: string[],
  opts: { minSignatures: string },
  cli: Program
) => {
  const InitOpts = t.type({ minSignatures: t.number });
  const dOptions = InitOpts.decode({
    minSignatures: Number(opts.minSignatures),
  });

  if (Either.isLeft(dOptions) || isNaN(dOptions.right.minSignatures)) {
    throw new Error("Invalid minSignatures");
  }
  const { minSignatures } = dOptions.right;

  const { programId, url } = populateOptions(cli);

  const client = Client(url, programId);

  await actions.init(client, {
    options: { minSignatures },
    arguments: populateSigners(args),
  });
};

/**
 * Initialize token pair
 */
export const init_token_pair = async () => {};

/**
 *
 */
export const list_multisig = async () => {};

/**
 *
 */
export const list_orders = async () => {};

/**
 *
 */
export const list_pools = async () => {};

/**
 *
 */
export const list_token_pairs = async () => {};

/**
 * Set admins
 */
export const set_admin_signers = () => {};

/**
 * Set `crank` authority
 */
export const set_crank_authority = () => {};

/**
 * Set fees
 */
export const set_fees = () => {};

/**
 * Set limits
 */
export const set_limits = () => {};

/**
 * Set `oracle` config
 */
export const set_oracle_config = () => {};

/**
 * Set permissions
 */
export const set_permissions = () => {};

/**
 * Set test `oracle` price
 */
export const set_test_oracle_price = () => {};

/**
 * Set test time
 */
export const set_test_time = () => {};

/**
 * Set `Time-in-force`
 */
export const set_time_in_force = () => {};

/**
 * Settle
 */
export const settle = () => {};

/**
 * Withdraw fees
 */
export const withdraw_fees = () => {};
