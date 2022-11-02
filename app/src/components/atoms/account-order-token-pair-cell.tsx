import Maybe from "easy-maybe/lib";
import type { GridCellParams } from "@mui/x-data-grid-pro";
import type { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

import PairCardSymbols from "./pair-card-symbols";
import { address } from "../../utils/twamm-client";
import { useTokenPairByPool } from "../../hooks/use-token-pair-by-pool";
import { useTokensByMint } from "../../hooks/use-tokens-by-mint";

export interface Props
  extends GridCellParams<
    void,
    {
      side: OrderTypeStruct;
      pool: PublicKey;
    }
  > {}

export default ({ row }: Pick<Props, "row">) => {
  const { pool: poolAddress } = row;

  const tokenPair = useTokenPairByPool(
    poolAddress ? { address: poolAddress } : undefined
  );

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

  return <PairCardSymbols data={Maybe.of(tokens.data)} />;
};
