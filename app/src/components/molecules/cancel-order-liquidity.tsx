import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useMemo } from "react";

import * as Styled from "./canel-order-liquidity.styled";
import { isFloat } from "../../utils/index";

export interface Props {
  ab: JupTokenData[];
  rate?: number;
}

const formatRate = (a: number) => (!isFloat(a) ? a : Number(a).toFixed(2));

export default ({ ab, rate = 10.234 }: Props) => {
  const a = { symbol: "SOL", amount: 2, image: "" };
  const b = { symbol: "USDT", amount: 60, image: "" };

  console.log({ ab });

  const pair = useMemo(() => {
    return ab.map((token) => ({
      symbol: token.symbol,
      amount: 2,
      image: token.logoURI,
    }));
  }, [ab]);

  return (
    <>
      <Card>
        <CardContent>
          {pair.map(({ amount, image, symbol }) => (
            <Styled.LiquidityItem key={symbol}>
              <Styled.ItemAmount>{amount}</Styled.ItemAmount>
              <Styled.ItemToken>
                <Styled.TokenImage src={image}>{symbol[0]}</Styled.TokenImage>
                <Styled.TokenName>{symbol.toUpperCase()}</Styled.TokenName>
              </Styled.ItemToken>
            </Styled.LiquidityItem>
          ))}
        </CardContent>
      </Card>
      <Box p={2}>
        <Styled.RateItem variant="body2">
          1 {a.symbol} = {formatRate(rate)} {b.symbol}
        </Styled.RateItem>
        <Styled.RateItem variant="body2">
          1 {b.symbol} = {formatRate(1 / rate)} {a.symbol}
        </Styled.RateItem>
      </Box>
    </>
  );
};
