import type { PublicKey } from "@solana/web3.js";
import type { GridColDef } from "@mui/x-data-grid-pro";
import { useMemo } from "react";

import Table from "../atoms/table";
import WalletGuard from "./wallet-guard";
import * as Styled from "./account-order-details.styled";

export interface Params {
  address: PublicKey;
}

export default (params: Params) => {
  const poolInception = { data: new Date() };
  const poolExpiration = { data: new Date() };
  const totalAssets = { data: [10, 100] };
  const totalAssetsSymbols = { data: ["SOL", "USDC"] };
  const prices = { data: [28.82, 30.12, 32.32] };
  const accountAssets = { data: [9, 99] };
  const accountAvgPrice = { data: [30.12] };

  return (
    <Styled.Container>
      <WalletGuard>
        <Styled.Stat>
          234
        </Styled.Stat>

        <Styled.Stat>
          234
        </Styled.Stat>

      </WalletGuard>
    </Styled.Container>
  );
};
