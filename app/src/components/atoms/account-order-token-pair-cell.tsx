import type { GridCellParams } from "@mui/x-data-grid-pro";
import type { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

import PairCardSymbols from "./pair-card-symbols";
import useTokenPairByPool from "../../hooks/use-token-pair-by-pool";
import useTokensByMint from "../../hooks/use-tokens-by-mint";
import { address } from "../../utils/twamm-client";

export interface Props
  extends GridCellParams<
    void,
    {
      side: OrderTypeStruct;
      pool: PublicKey;
    }
  > {}

export default ({ row }: Pick<Props, "row">) => {
  const tokenPair = useTokenPairByPool(row.pool);

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

  return <PairCardSymbols data={tokens.data} />;
};
