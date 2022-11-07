import type { Cluster, Commitment as Cmtmnt } from "@solana/web3.js";
import type { FC, ReactNode } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { createContext, useCallback, useMemo, useState } from "react";

import { ClusterApiUrl } from "../env";

const clusterStorage = (function () {
  const STORAGE_KEY = "twammClusterEndpoint";
  const ENABLE_STORAGE_KEY = "twammEnableClusterEndpoint";

  const self = {
    disable() {
      if (global.localStorage) {
        global.localStorage.removeItem(ENABLE_STORAGE_KEY);
      }
    },
    enable() {
      if (global.localStorage) {
        global.localStorage.setItem(ENABLE_STORAGE_KEY, "1");
      }
    },
    enabled() {
      if (global.localStorage) {
        return global.localStorage.getItem(ENABLE_STORAGE_KEY) === "1";
      }

      return false;
    },
    get() {
      if (global.localStorage) {
        const uri = global.localStorage.getItem(STORAGE_KEY);
        return uri ? decodeURI(uri) : undefined;
      }
      return undefined;
    },
    set(endpoint: string) {
      if (globalThis.localStorage) {
        self.enable();
        globalThis.localStorage.setItem(
          STORAGE_KEY,
          encodeURI(endpoint.trim())
        );
      }
    },
  };

  return self;
})();

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
      name: "Solana",
      endpoint: ClusterApiUrl || clusterApiUrl("mainnet-beta"),
      moniker: "mainnet-beta",
    },
    {
      name: "Custom",
      endpoint: ClusterApiUrl ?? '',
      moniker: "custom",
    },
    /*
     *{
     *  name: "Testnet",
     *  endpoint: clusterApiUrl("testnet"),
     *  moniker: "testnet",
     *},
     *{
     *  name: "Devnet",
     *  endpoint: clusterApiUrl("devnet"),
     *  moniker: "devnet",
     *},
     */
  ]);

  const initialCommitment = commitments[0];

  const customEndpoint = clusterStorage.enabled()
    ? clusterStorage.get()
    : undefined;

  const initialCluster: ClusterInfo = customEndpoint
    ? {
        name: "Custom",
        endpoint: customEndpoint,
        moniker: "custom",
      }
    : clusters[0];

  const [commitment] = useState(initialCommitment);
  const [cluster, setCluster] = useState(initialCluster);

  const changeCluster = useCallback(
    (info: ClusterInfo) => {
      if (info.moniker === "custom") {
        clusterStorage.enable();
        clusterStorage.set(info.endpoint);
      } else {
        clusterStorage.disable();
      }
      setCluster(info);
    },
    [clusterStorage, setCluster]
  );

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
