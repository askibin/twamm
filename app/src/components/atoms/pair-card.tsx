import type { PublicKey } from "@solana/web3.js";
import Maybe from "easy-maybe/lib";

import * as Styled from "./pair-card.styled";
import Metric, { formatDeposited } from "./pair-card-metrics";
import PairCardSymbols from "./pair-card-symbols";
import useTokensByMint from "../../hooks/use-tokens-by-mint";
import { address } from "../../utils/twamm-client";

export interface Props {
  aMint: PublicKey;
  bMint: PublicKey;
  fee: number;
  orderVolume: number;
  perf: number;
  settleVolume: number;
  tradeVolume: number;
}

export default ({
  aMint,
  bMint,
  fee,
  orderVolume,
  perf,
  settleVolume,
  tradeVolume,
}: Props) => {
  const tokens = useTokensByMint([
    address(aMint).toString(),
    address(bMint).toString(),
  ]);

  const data = Maybe.of(tokens.data);

  return (
    <Styled.Root>
      <Styled.Card>
        <Styled.Fund>
          <Styled.FundName>
            <PairCardSymbols data={data} />
          </Styled.FundName>
          <Styled.FundPerf>
            {perf ? (
              <Styled.FundPerfValue>
                ${formatDeposited(perf)}
              </Styled.FundPerfValue>
            ) : (
              <Styled.FundPerfValue>-</Styled.FundPerfValue>
            )}
          </Styled.FundPerf>
        </Styled.Fund>
        <Styled.FundMetrics>
          <Metric formatted title="Fee" value={fee} />
          <Metric formatted title="Order" value={orderVolume} />
          <Metric formatted title="Settle" value={settleVolume} />
          <Metric formatted title="Trade" value={tradeVolume} />
        </Styled.FundMetrics>
      </Styled.Card>
    </Styled.Root>
  );
};

export const Blank = () => <Styled.FundSkeleton variant="rectangular" />;
