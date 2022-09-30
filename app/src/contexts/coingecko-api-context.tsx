import type { FC, ReactNode } from "react";
import { createContext, useState } from "react";

import { CoinsApi, ContractApi } from "../api/coingecko";

export type CoingeckoApiContextType = {
  api: CoinsApi;
  contractApi: ContractApi;
};

export const ApiContext = createContext<CoingeckoApiContextType | undefined>(
  undefined
);

export const CoingeckoApiProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [context] = useState<CoingeckoApiContextType>({
    api: new CoinsApi(),
    contractApi: new ContractApi(),
  });

  return <ApiContext.Provider value={context}>{children}</ApiContext.Provider>;
};
