import type { Revalidator, RevalidatorOptions, SWRConfiguration } from "swr";

// import { localStorageProvider as provider } from "./swr-cache";

export const retryFor = (interval = 10000, retryAttempts = 5) => ({
  refreshInterval: interval,
  onErrorRetry: (
    resp: Error,
    key: string,
    configuration: SWRConfiguration,
    revalidate: Revalidator,
    revalidatorOpts: Required<RevalidatorOptions>
  ) => {
    const { refreshInterval } = configuration;
    const { retryCount } = revalidatorOpts;

    // TODO: cover 404 codes from jsonrpc
    if (retryCount > retryAttempts) return;

    const retryIn =
      typeof refreshInterval === "number" ? refreshInterval : interval;

    setTimeout(revalidate, retryIn, { retryCount });
  },
});

export const dedupeEach = (dedupingInterval = 2000) => ({ dedupingInterval });

export const revalOnFocus = (revalidateOnFocus = false) => ({
  revalidateOnFocus,
});

export const refreshEach = (refreshInterval = 5000) => ({ refreshInterval });

interface ConfigurationWithProvider extends SWRConfiguration {
  provider?: typeof provider;
}

export default (config?: SWRConfiguration): ConfigurationWithProvider => ({
  ...(config || {}),
  ...dedupeEach(20e3),
  ...revalOnFocus(),
  ...retryFor(),
  // provider,
});
