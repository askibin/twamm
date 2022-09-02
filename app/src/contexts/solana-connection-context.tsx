import type { Cluster as ClusterMoniker, Commitment } from "@solana/web3.js";
import type { FC, ReactNode } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { createContext, useState } from "react";

export type Cluster = {
  name: string;
  endpoint: string;
  moniker?: ClusterMoniker;
};

export type SolanaConnectionContextType = {
  readonly connection: (commitment?: Commitment) => Connection;
  readonly clusters: Cluster[];
  readonly cluster: Cluster;
  readonly setCluster: (cluster: Cluster) => void;
};

export const SolanaConnectionContext = createContext<
  SolanaConnectionContextType | undefined
>(undefined);

export const SolanaConnectionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
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

  const [cluster, setCluster] = useState(clusters[0]);

  const connection = (commitment: Commitment = "confirmed") =>
    new Connection(cluster.endpoint, commitment);

  return (
    <SolanaConnectionContext.Provider
      value={{
        clusters,
        cluster,
        setCluster,
        connection,
      }}
    >
      {children}
    </SolanaConnectionContext.Provider>
  );
};
