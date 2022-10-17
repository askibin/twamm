import type { PublicKey } from "@solana/web3.js";
import type { GridRenderCellParams } from "@mui/x-data-grid-pro";

import TokenPairSymbols from "./pair-card-symbols";
import { useTokenPairByPool } from "../../hooks/use-token-pair-by-pool";
import { useTokensByMint } from "../../hooks/use-tokens-by-mint";

export interface Params extends GridRenderCellParams<PublicKey> {}

export default ({ value }: Params) => {
  const tokenPair = useTokenPairByPool(value ? { address: value } : undefined);

  const mints = tokenPair.data
    ? [
        tokenPair.data.configA.mint.toBase58(),
        tokenPair.data.configB.mint.toBase58(),
      ]
    : undefined;

  const tokens = useTokensByMint(mints);

  return <TokenPairSymbols data={tokens.data} />;
};
