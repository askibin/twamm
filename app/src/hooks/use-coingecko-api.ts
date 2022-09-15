import { useContext } from "react";

import { ApiContext } from "../contexts/coingecko-api-context";

// eslint-disable-next-line import/prefer-default-export
export function useCoingeckoApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("Coingecko context is required");
  }
  return context.api;
}
