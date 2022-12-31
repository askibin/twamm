import type { Address, Idl } from "@project-serum/anchor";

import idlJson from "../idl.json";

export const idl = idlJson as Idl;

export const JUPITER_CONFIG_URI = "https://quote-api.jup.ag";

export const JUPITER_PRICE_ENDPOINT_V1 = "https://price.jup.ag/v1/price";

export const AnkrClusterApiUrl = "https://rpc.ankr.com/solana";

// TODO: cover absent env value
export const ClusterApiUrl = process.env.NEXT_PUBLIC_CLUSTER_API_URL;

export const programId: Address | undefined =
  process.env.NEXT_PUBLIC_PROGRAM_ADDRESS;
