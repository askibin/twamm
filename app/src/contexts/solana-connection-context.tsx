import type { Cluster, Commitment } from "@solana/web3.js";
import type { FC, ReactNode } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { ENV as ChainIdEnv } from "@solana/spl-token-registry";
import endpointStorage from "../utils/cluster-endpoint-storage";
import { AnkrClusterApiUrl, ClusterApiUrl } from "../env";

const clusterStorage = endpointStorage();

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

export const chainId = ChainIdEnv.MainnetBeta;

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

const COMMITMENT = "confirmed";

export type BlockchainConnectionContextType = {
  readonly cluster: ClusterInfo;
  readonly clusters: ClusterInfo[];
  readonly commitment: CommitmentLevel;
  readonly connection: Connection;
  readonly createConnection: (commitment?: CommitmentLevel) => Connection;
  readonly setCluster: (cluster: ClusterInfo) => void;
};

export const BlockchainConnectionContext = createContext<
  BlockchainConnectionContextType | undefined
>(undefined);

export const BlockchainConnectionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const commitment: CommitmentLevel = COMMITMENT;

  const [clusters] = useState(
    [endpoints.solana].concat([endpoints.ankr, endpoints.custom])
  );

  const customEndpoint = clusterStorage.enabled()
    ? clusterStorage.get()
    : undefined;

  const initialCluster: ClusterInfo = customEndpoint
    ? endpoints.custom
    : clusters[0];

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
    (commit: CommitmentLevel = commitment) => {
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

  return (
    <BlockchainConnectionContext.Provider value={contextValue}>
      {children}
    </BlockchainConnectionContext.Provider>
  );
};

export default () => {
  const context = useContext(BlockchainConnectionContext);
  if (context === undefined) {
    throw new Error("Solana connection context required");
  }

  return context;
};
