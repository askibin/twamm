import type { Cluster, Commitment as Cmtmnt } from "@solana/web3.js";
import type { FC, ReactNode } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { createContext, useCallback, useMemo, useRef, useState } from "react";

import endpointStorage from "../utils/cluster-endpoint-storage";
import { AnkrClusterApiUrl, ClusterApiUrl } from "../env";

const clusterStorage = endpointStorage();

export type Commitment = "confirmed";

export type CustomClusterInfo = {
  name: "Custom";
  endpoint: string;
  moniker: "custom";
};

export type ClusterInfo = {
  name: string;
  endpoint: string;
  moniker?: Cluster | "custom" | "ankr-solana";
};

export const endpoints: Record<string, ClusterInfo> = {
  ankr: {
    name: "Ankr",
    endpoint: AnkrClusterApiUrl,
    moniker: "ankr-solana",
  },
  solana: {
    name: "Solana",
    endpoint: ClusterApiUrl || clusterApiUrl("mainnet-beta"),
    moniker: "mainnet-beta",
  },
  custom: {
    name: "Custom",
    endpoint: clusterStorage.get() ?? "",
    moniker: "custom",
  },
};

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

  const [clusters] = useState(
    [endpoints.solana].concat([endpoints.ankr, endpoints.custom])
  );

  const initialCommitment = commitments[0];

  const customEndpoint = clusterStorage.enabled()
    ? clusterStorage.get()
    : undefined;

  const initialCluster: ClusterInfo = customEndpoint
    ? endpoints.custom
    : clusters[0];

  const [commitment] = useState(initialCommitment);
  const [cluster, setCluster] = useState(initialCluster);

  const connectionRef = useRef<Connection>(
    new Connection(initialCluster.endpoint, commitment)
  );

  const changeCluster = useCallback(
    (info: ClusterInfo) => {
      if (info.moniker === endpoints.custom.moniker) {
        clusterStorage.enable();
        clusterStorage.set(info.endpoint);
      } else {
        clusterStorage.disable();
      }
      setCluster(info);
    },
    [setCluster]
  );

  const createConnection = useCallback(
    (commit: Cmtmnt = initialCommitment) => {
      const prevEndpoint =
        connectionRef.current && connectionRef.current.rpcEndpoint;

      if (!prevEndpoint || prevEndpoint !== cluster.endpoint) {
        const conn = new Connection(cluster.endpoint, commit);
        connectionRef.current = conn;

        return conn;
      }

      return connectionRef.current;
    },
    [cluster, initialCommitment]
  );

  const contextValue = useMemo(
    () => ({
      cluster,
      clusters,
      commitment,
      createConnection,
      setCluster: changeCluster,
    }),
    [cluster, clusters, changeCluster, commitment, createConnection]
  );

  return (
    <BlockchainConnectionContext.Provider value={contextValue}>
      {children}
    </BlockchainConnectionContext.Provider>
  );
};
