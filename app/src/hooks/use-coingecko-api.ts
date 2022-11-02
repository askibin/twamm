import { useContext } from "react";

import { ApiContext } from "../contexts/coingecko-api-context";

export default () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("Coingecko context is required");
  }
  return context.contractApi;
};
