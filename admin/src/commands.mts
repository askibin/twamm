import * as web3 from "@solana/web3.js";

export const populateSigners = (signers: string[]) =>
  signers.map((signer) => new web3.PublicKey(signer));

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
