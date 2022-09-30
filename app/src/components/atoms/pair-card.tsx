import * as Styled from "./pair-card.styled";
import Metric from "./pair-card-metrics";
import TokenPairSymbols from "./pair-card-symbols";
import { useTokensByMint } from "../../hooks/use-tokens-by-mint";

export interface FundPerf {
  aMint: string;
  bMint: string;
  perf: number;
  fee: number;
}

export default ({
  aMint,
  bMint,
  perf,
  fee /* , deposited = 0 */,
}: FundPerf) => {
  const { data } = useTokensByMint([aMint, bMint]);

  return (
    <Styled.Root>
      <Styled.Card>
        <Styled.Fund>
          <Styled.FundName>
            <TokenPairSymbols data={data} />
          </Styled.FundName>
          <Styled.FundPerf>
            {perf ? (
              <>
                <Styled.FundPerfValue>{perf}%</Styled.FundPerfValue>{" "}
                <span>7D Perf</span>
              </>
            ) : (
              <Styled.FundPerfValue>-</Styled.FundPerfValue>
            )}
          </Styled.FundPerf>
        </Styled.Fund>
        <Styled.FundMetrics>
          <Metric formatted title="Fee" value={fee} />
        </Styled.FundMetrics>
      </Styled.Card>
    </Styled.Root>
  );
};

export const Blank = () => <Styled.FundSkeleton variant="rectangular" />;
