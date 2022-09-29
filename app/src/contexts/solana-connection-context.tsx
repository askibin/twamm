import type { Cluster as Clstr, Commitment as Cmtmnt } from "@solana/web3.js";
import type { FC, ReactNode } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { createContext, useCallback, useMemo, useState } from "react";

export type Cluster = {
  name: string;
  endpoint: string;
  moniker?: Clstr;
};

export type Commitment = "confirmed";

export type BlockchainConnectionContextType = {
  readonly cluster: Cluster;
  readonly clusters: Cluster[];
  readonly commitment: Commitment;
  readonly createConnection: (commitment?: Commitment) => Connection;
  readonly setCluster: (cluster: Cluster) => void;
};

export const BlockchainConnectionContext = createContext<
  BlockchainConnectionContextType | undefined
>(undefined);

export const BlockchainConnectionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [commitments] = useState<Commitment[]>(["confirmed"]);

  const [clusters] = useState<Cluster[]>([
    {
      name: "Mainnet Beta",
      endpoint: clusterApiUrl("mainnet-beta"),
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

  const [commitment] = useState(initialCommitment);
  const [cluster, setCluster] = useState(clusters[0]);

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
