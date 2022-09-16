import * as Styled from "./pair-card.styled";

export interface FundPerf {
  name: string;
  perf: number;
  aum: number;
  deposited?: number;
}

interface MetricProps {
  title: string;
  value: string;
}

const formatDeposited = (value: number): string => {
  const RANKS = ["K", "M", "B", "T"];
  const TRESHOLD = 1e3;

  let idx = 0;

  // eslint-disable-next-line no-plusplus, no-param-reassign
  while (value >= TRESHOLD && ++idx <= RANKS.length) value /= TRESHOLD;

  return String(
    idx === 0 ? value : value.toFixed(1).replace(/\.?0+$/, "") + RANKS[idx - 1]
  );
};

const Metric = ({ title, value }: MetricProps) => (
  <div>
    <Styled.FundMetricName>{title}</Styled.FundMetricName>
    <Styled.FundMetricValue>{value}</Styled.FundMetricValue>
  </div>
);

export default ({ name, perf, aum, deposited = 0 }: FundPerf) => (
  <Styled.Root>
    <Styled.Card>
      <Styled.Fund>
        <Styled.FundName>{name}</Styled.FundName>
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
        <Metric title="AUM" value={`$${formatDeposited(aum)}`} />
        <Metric title="Depositors" value={`$${formatDeposited(deposited)}`} />
      </Styled.FundMetrics>
    </Styled.Card>
  </Styled.Root>
);

export const Blank = () => <Styled.FundSkeleton variant="rectangular" />;
