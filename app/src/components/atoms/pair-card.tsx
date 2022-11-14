import type { PublicKey } from "@solana/web3.js";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import * as Styled from "./pair-card.styled";
import Metric from "./pair-card-metrics";
import PairCardSymbols from "./pair-card-symbols";
import useTokensByMint from "../../hooks/use-tokens-by-mint";
import { address } from "../../utils/twamm-client";

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
  const tokens = useTokensByMint([
    address(aMint).toString(),
    address(bMint).toString(),
  ]);

  // Fee: collected fees: fees collcted & pending withdrawals

  return (
    <Styled.Root>
      <Styled.Card>
        <Styled.Fund>
          <Styled.FundName>
            <PairCardSymbols data={tokens.data} />
          </Styled.FundName>
          {/*
           *<Styled.FundPerf>
           *  {perf ? (
           *    <Styled.FundPerfValue>
           *      ${formatDeposited(perf)}
           *    </Styled.FundPerfValue>
           *  ) : (
           *    <Styled.FundPerfValue>-</Styled.FundPerfValue>
           *  )}
           *</Styled.FundPerf>
           */}
        </Styled.Fund>
        <Box pb={2.5}>
          <Styled.FundMetrics>
            <Metric formatted title="Fee" value={fee} />
          </Styled.FundMetrics>
        </Box>
        <Box pb={0.5}>
          <Typography variant="h6">Volume</Typography>
        </Box>
        <Styled.FundMetrics>
          <Metric formatted title="Order" value={orderVolume} />
          <Metric formatted title="Settle" value={settleVolume} />
          <Metric formatted title="Trade" value={tradeVolume} />
        </Styled.FundMetrics>
      </Styled.Card>
    </Styled.Root>
  );
};

export const Blank = () => <Styled.FundSkeleton variant="rectangular" />;
