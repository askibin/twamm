import type { Cluster, Commitment } from "@solana/web3.js";

export type CommitmentLevel = Extract<Commitment, "confirmed">;

type PresetMoniker = Extract<Cluster, "mainnet-beta"> | "ankr-solana";

export type Moniker = PresetMoniker | "custom";

type CustomClusterInfo = {
  name: string;
  endpoint: string | undefined;
  moniker: "custom";
};

type PresetClusterInfo = {
  name: string;
  endpoint: string;
  moniker: Exclude<Moniker, "custom">;
};

export type ClusterInfo = PresetClusterInfo;

export type AnyClusterInfo = CustomClusterInfo | ClusterInfo;
