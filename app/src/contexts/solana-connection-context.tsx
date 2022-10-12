import type { Cluster, Commitment as Cmtmnt } from "@solana/web3.js";
import type { FC, ReactNode } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { createContext, useCallback, useMemo, useState } from "react";

import { ClusterApiUrl } from "../env";

export type ClusterInfo = {
  name: string;
  endpoint: string;
  moniker?: Cluster | "custom";
};

export type Commitment = "confirmed";

export type BlockchainConnectionContextType = {
  readonly cluster: ClusterInfo;
  readonly clusters: ClusterInfo[];
  readonly commitment: Commitment;
  readonly createConnection: (commitment?: Commitment) => Connection;
  readonly setCluster: (cluster: ClusterInfo) => void;
};

export const BlockchainConnectionContext = createContext<
  BlockchainConnectionContextType | undefined
>(undefined);

export const BlockchainConnectionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [commitments] = useState<Commitment[]>(["confirmed"]);

  const [clusters] = useState<ClusterInfo[]>([
    {
      name: "Mainnet Beta",
      endpoint: ClusterApiUrl || clusterApiUrl("mainnet-beta"),
      moniker: "mainnet-beta",
    },
    {
      name: "Testnet",
      endpoint: clusterApiUrl("testnet"),
      moniker: "testnet",
    },
    {
      name: "Devnet",
      endpoint: clusterApiUrl("devnet"),
      moniker: "devnet",
    },
  ]);

  const initialCommitment = commitments[0];

  let initialCluster: ClusterInfo = clusters[0];
  if (globalThis.localStorage) {
    const customEndpoint =
      globalThis.localStorage?.getItem("twammClusterEndpoint") ??
      clusters[0].endpoint;
    // TODO: validate endpoint && handle custom outage gracefully
    initialCluster = {
      name: "Custom",
      endpoint: customEndpoint,
      moniker: "custom",
    };
  }

  const [commitment] = useState(initialCommitment);
  const [cluster, setCluster] = useState(initialCluster);

  const createConnection = useCallback(
    (commit: Cmtmnt = initialCommitment) =>
      new Connection(cluster.endpoint, commit),
    [cluster, initialCommitment]
  );

  const contextValue = useMemo(
    () => ({
      cluster,
      clusters,
      commitment,
      createConnection,
      setCluster,
    }),
    [cluster, clusters, commitment, createConnection, setCluster]
  );

  return (
    <BlockchainConnectionContext.Provider value={contextValue}>
      {children}
    </BlockchainConnectionContext.Provider>
  );
};
