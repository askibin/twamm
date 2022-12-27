import type { FC, ReactNode } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import R, { useCallback, useContext, useMemo, useRef, useState } from "react";
import { ENV as ChainIdEnv } from "@solana/spl-token-registry";
import type * as T from "./solana-connection-context.d";
import endpointStorage from "../utils/cluster-endpoint-storage";
import { AnkrClusterApiUrl, ClusterApiUrl } from "../env";

const clusterStorage = endpointStorage();

export const chainId = ChainIdEnv.MainnetBeta;

export const endpoints: Record<string, T.ClusterInfo> = {
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

const COMMITMENT = "confirmed";

export type SolanaConnectionContext = {
  readonly cluster: T.ClusterInfo;
  readonly clusters: T.ClusterInfo[];
  readonly commitment: T.CommitmentLevel;
  readonly connection: Connection;
  readonly createConnection: (commitment?: T.CommitmentLevel) => Connection;
  readonly setCluster: (cluster: T.ClusterInfo) => void;
};

export const Context = R.createContext<SolanaConnectionContext | undefined>(
  undefined
);

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const commitment: T.CommitmentLevel = COMMITMENT;

  const [clusters] = useState(
    [endpoints.solana].concat([endpoints.ankr, endpoints.custom])
  );

  const customEndpoint = clusterStorage.enabled()
    ? clusterStorage.get()
    : undefined;

  const initialCluster: T.ClusterInfo = customEndpoint
    ? endpoints.custom
    : clusters[0];

  const [cluster, setCluster] = useState(initialCluster);

  const connectionRef = useRef<Connection>(
    new Connection(initialCluster.endpoint, commitment)
  );

  const changeCluster = useCallback(
    (info: T.ClusterInfo) => {
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
    (commit: T.CommitmentLevel = commitment) => {
      const prevEndpoint =
        connectionRef.current && connectionRef.current.rpcEndpoint;

      if (!prevEndpoint || prevEndpoint !== cluster.endpoint) {
        const conn = new Connection(cluster.endpoint, commit);
        connectionRef.current = conn;

        // TODO: add notifications about RPC change

        return connectionRef.current;
      }

      return connectionRef.current;
    },
    [cluster, commitment]
  );

  const contextValue = useMemo(
    () => ({
      cluster,
      clusters,
      commitment,
      connection: connectionRef.current,
      createConnection,
      setCluster: changeCluster,
    }),
    [cluster, clusters, changeCluster, commitment, createConnection]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("Solana connection context required");
  }

  return context;
};
