import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Maybe, { Extra } from "easy-maybe/lib";
import { useMemo } from "react";

import * as Styled from "./cancel-order-liquidity.styled";
import { isFloat } from "../../utils/index";

export interface Props {
  ab: JupTokenData[];
  errorData: Voidable<Error>;
  priceData: Voidable<number>;
}

const formatRate = (a: number) => (!isFloat(a) ? a : Number(a).toFixed(2));

export default ({ ab, errorData, priceData }: Props) => {
  const data = Maybe.of(priceData);
  const error = Maybe.of(errorData);

  const pair = useMemo(
    () =>
      ab.map((token) => ({
        symbol: token.symbol,
        amount: 2,
        image: token.logoURI,
      })),
    [ab]
  );

  const [a, b] = pair;

  const price = Maybe.andThen(
    (d) => Maybe.of(Extra.isJust(error) ? undefined : d),
    data
  );

  const p = Maybe.withDefault(undefined, price);

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
      {Extra.isJust(error) && (
        <Box py={2}>
          <Alert severity="error">{Maybe.unwrap(error)?.message}</Alert>
        </Box>
      )}
      {Extra.isJust(price) && (
        <Box py={2} px={2}>
          <Styled.RateItem variant="body2">
            1 {a.symbol} = {!p ? "-" : formatRate(p)} {b.symbol}
          </Styled.RateItem>
          <Styled.RateItem variant="body2">
            1 {b.symbol} = {!p ? "-" : formatRate(1 / p)} {a.symbol}
          </Styled.RateItem>
        </Box>
      )}
    </>
  );
};
