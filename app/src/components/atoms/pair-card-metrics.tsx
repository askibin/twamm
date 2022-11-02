import * as Styled from "./pair-card-metrics.styled";

export interface MetricProps {
  title: string;
  value: number;
  formatted?: boolean;
}

export const formatDeposited = (value: number): string => {
  const RANKS = ["K", "M", "B", "T"];
  const TRESHOLD = 1e3;
  const formatUnranked = (a: number) => (a === 0 ? a : a.toFixed(3));

  let idx = 0;

  // eslint-disable-next-line no-plusplus, no-param-reassign
  while (value >= TRESHOLD && ++idx <= RANKS.length) value /= TRESHOLD;

  return String(
    idx === 0
      ? formatUnranked(value)
      : value.toFixed(1).replace(/\.?0+$/, "") + RANKS[idx - 1]
  );
};

export default ({ formatted = false, title, value }: MetricProps) => (
  <div>
    <Styled.FundMetricName>{title}</Styled.FundMetricName>
    <Styled.FundMetricValue>
      {formatted ? `$${formatDeposited(value)}` : value}
    </Styled.FundMetricValue>
  </div>
);
