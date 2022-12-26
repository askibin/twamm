import type { Cluster, Commitment } from "@solana/web3.js";

export type CommitmentLevel = Extract<Commitment, "confirmed">;

type Moniker = Extract<Cluster, "mainnet-beta"> | "custom" | "ankr-solana";

export type CustomClusterInfo = {
  name: "Custom";
  endpoint: string;
  moniker: "custom";
};

export type ClusterInfo = {
  name: string;
  endpoint: string;
  moniker: Moniker | undefined;
};
