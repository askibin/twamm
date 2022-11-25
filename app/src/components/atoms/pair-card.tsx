import type { PublicKey } from "@solana/web3.js";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import * as Styled from "./pair-card.styled";
import Metric, { formatDeposited } from "./pair-card-metrics";
import PairCardSymbols from "./pair-card-symbols";
import useTokensByMint from "../../hooks/use-tokens-by-mint";

export interface Props {
  aMint: PublicKey;
  bMint: PublicKey;
  fee: number;
  orderVolume: number;
  settleVolume: number;
  tradeVolume: number;
}

export default ({
  aMint,
  bMint,
  fee,
  orderVolume,
  settleVolume,
  tradeVolume,
}: Props) => {
  const tokens = useTokensByMint([aMint, bMint]);

  return (
    <Styled.Root>
      <Styled.Card>
        <Styled.Fund>
          <Styled.FundName>
            <PairCardSymbols data={tokens.data} />
          </Styled.FundName>
        </Styled.Fund>
        <Box pb={0.5}>
          <Typography variant="h6">Volume</Typography>
        </Box>
        <Box>
          <Styled.FundMetrics>
            <Metric formatted title="Order" value={orderVolume} />
            <Metric formatted title="Settle" value={settleVolume} />
            <Metric formatted title="Trade" value={tradeVolume} />
          </Styled.FundMetrics>
        </Box>
        <Box pt={1}>Protocol Fee: {fee ? formatDeposited(fee) : 0}</Box>
      </Styled.Card>
    </Styled.Root>
  );
};

export const Blank = () => <Styled.FundSkeleton variant="rectangular" />;
