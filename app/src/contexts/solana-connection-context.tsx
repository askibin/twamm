import type { FC, ReactNode } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import R, { useCallback, useContext, useMemo, useRef, useState } from "react";
import { ENV as ChainIdEnv } from "@solana/spl-token-registry";
import type * as T from "./solana-connection-context.d";
import endpointStorage from "../utils/cluster-endpoint-storage";
import { AnkrClusterApiUrl, ClusterApiUrl } from "../env";
import ClusterUtils from "../domain/cluster";

const clusterStorage = endpointStorage();

const COMMITMENT = "confirmed";

export const chainId = ChainIdEnv.MainnetBeta;

export const endpoints: Record<string, T.AnyClusterInfo> = {
  ankr: {
    name: "Ankr",
    endpoint: AnkrClusterApiUrl,
    moniker: "ankr-solana",
  },
  solana: {
    name: "Solana",
    endpoint: ClusterApiUrl ?? clusterApiUrl("mainnet-beta"),
    moniker: "mainnet-beta",
  },
  custom: {
    name: "Custom",
    endpoint: clusterStorage.get(),
    moniker: "custom",
  },
};

const fallbackCluster = endpoints.solana as T.ClusterInfo;

const isCustomCluster = (c: T.AnyClusterInfo) =>
  c.moniker === endpoints.custom.moniker;

export type SolanaConnectionContext = {
  readonly cluster: T.ClusterInfo;
  readonly clusters: T.ClusterInfo[];
  readonly commitment: T.CommitmentLevel;
  readonly connection: Connection;
  readonly createConnection: (commitment?: T.CommitmentLevel) => Connection;
  readonly setCluster: (cluster: T.ClusterInfo | T.Moniker) => boolean;
};

export const Context = R.createContext<SolanaConnectionContext | undefined>(
  undefined
);

const clstorage = clusterStorage;

const cluster = ClusterUtils(fallbackCluster);

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const hasStoredEndpoint = Boolean(clstorage.enabled() && clstorage.get());

  const initialClusters = hasStoredEndpoint
    ? [
        endpoints.solana,
        endpoints.ankr,
        {
          name: "Custom",
          endpoint: clstorage.get(),
          moniker: "custom" as T.Moniker,
        } as T.PresetClusterInfo,
      ]
    : [endpoints.solana, endpoints.ankr];

  const [commitment] = useState<T.CommitmentLevel>(COMMITMENT);
  const [clusters] = useState<T.ClusterInfo[]>(initialClusters);

  const initialCluster = hasStoredEndpoint
    ? cluster.findBy(clstorage.get(), clusters)
    : fallbackCluster;
  console.log("CLS1", clstorage.get(), initialCluster);

  const [currentCluster, setCurrentCluster] = useState(initialCluster);

  const clusterData = useMemo(() => {
    const presetClusters = clusters.filter(
      (c) => !isCustomCluster(c)
    ) as T.ClusterInfo[];

    return { preset: presetClusters };
  }, [clusters]);

  const presetClusters = clusterData.preset;

  const presetEndpoints = presetClusters.map((c) => c.endpoint);

  const hasCustomEndpoint = Boolean(
    hasStoredEndpoint && !presetEndpoints.includes(endpoints.custom.endpoint)
  );

  console.info("cluster get", clusterStorage.get());

  console.info("cluster", {
    cls: clusterStorage.get(),
    initialCluster,
    hasCustomEndpoint,
    hasStoredEndpoint,
  });

  const connectionRef = useRef<Connection>(
    new Connection(currentCluster.endpoint, commitment)
  );

  console.info("cluster current", currentCluster);

  const changeCluster = useCallback(
    (value: T.ClusterInfo | T.Moniker) => {
      const target =
        typeof value !== "string"
          ? value
          : cluster.findByMoniker(value, clusters);

      console.info("cluster next", target);

      const isValid = clusterStorage.set(target.endpoint);
      // TODO: fixup multiple responsibilities 4 .set

      console.log({ isValid });

      if (!(isValid instanceof Error)) {
        setCurrentCluster(target);
      }

      return isValid;
    },
    [clusters, setCurrentCluster]
  );

  const createConnection = useCallback(
    (commit: T.CommitmentLevel = commitment) => {
      const prevEndpoint =
        connectionRef.current && connectionRef.current.rpcEndpoint;

      if (!prevEndpoint || prevEndpoint !== currentCluster.endpoint) {
        const conn = new Connection(currentCluster.endpoint, commit);
        connectionRef.current = conn;

        // TODO: add notifications about RPC change

        return connectionRef.current;
      }

      return connectionRef.current;
    },
    [currentCluster, commitment]
  );

  const contextValue = useMemo(
    () => ({
      cluster: currentCluster,
      clusters,
      commitment,
      connection: connectionRef.current,
      createConnection,
      setCluster: changeCluster,
    }),
    [currentCluster, clusters, changeCluster, commitment, createConnection]
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
