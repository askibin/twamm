import type { AnyClusterInfo, ClusterInfo } from "./cluster.d";

type PredicateFn = (item: AnyClusterInfo) => boolean;

const CUSTOM_MONIKER = "custom";

const findByEndpoint = (endpoint: string, c: AnyClusterInfo) =>
  c.endpoint === endpoint;

export default function cluster(fallback: ClusterInfo) {
  const self = {
    findBy: (
      valueOrPredicate: string | PredicateFn | undefined,
      clusters: AnyClusterInfo[],
      defaultValue = fallback
    ) => {
      if (!valueOrPredicate) return defaultValue;

      const predicate =
        typeof valueOrPredicate === "function"
          ? valueOrPredicate
          : (c: AnyClusterInfo) => findByEndpoint(valueOrPredicate, c);

      return (clusters.find((c) => predicate(c)) ??
        defaultValue) as ClusterInfo;
    },
    findByMoniker: (
      moniker: string | undefined,
      clusters: AnyClusterInfo[]
    ) => {
      const monikerPredicate = (c: AnyClusterInfo) => c.moniker === moniker;

      return self.findBy(monikerPredicate, clusters);
    },
    isCustomMoniker: (moniker: string) => moniker === CUSTOM_MONIKER,
    isCustom: (c: ClusterInfo) => self.isCustomMoniker(c.moniker),
  };

  return self;
}
