import type { PublicKey } from "@solana/web3.js";
import type { GridCellParams } from "@mui/x-data-grid-pro";
import { useMemo } from "react";

import TokenPairSymbols from "./pair-card-symbols";
import { address } from "../../utils/twamm-client";
import { useTokenPairByPool } from "../../hooks/use-token-pair-by-pool";
import { useTokensByMint } from "../../hooks/use-tokens-by-mint";

export interface Params extends GridCellParams<PublicKey> {}

export default ({ value }: Pick<Params, "value">) => {
  const tokenPair = useTokenPairByPool(value ? { address: value } : undefined);

  const mints = useMemo(
    () =>
      tokenPair.data
        ? [
            address(tokenPair.data.configA.mint).toString(),
            address(tokenPair.data.configB.mint).toString(),
          ]
        : undefined,
    [tokenPair.data]
  );

  const tokens = useTokensByMint(mints);

  return <TokenPairSymbols data={tokens.data} />;
};
