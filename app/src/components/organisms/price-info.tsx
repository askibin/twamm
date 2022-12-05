import Box from "@mui/material/Box";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Maybe, { Extra } from "easy-maybe/lib";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import * as Styled from "./price-info.styled";
import IntervalProgress from "../atoms/interval-progress";
import PairCardSymbols from "../atoms/pair-card-symbols";
import useBreakpoints from "../../hooks/use-breakpoints";
import usePrice from "../../hooks/use-price";
import { formatPrice, populatePairByType } from "../../domain/index";
import { populateStats } from "../../domain/token-pair-details";
import { refreshEach } from "../../swr-options";

const { andMap, of, withDefault } = Maybe;
const { combine2 } = Extra;

const REFRESH_INTERVAL = 0.5 * 60000;

export interface Props {
  a?: JupTokenData;
  b?: JupTokenData;
  tokenPair: Voidable<{
    configA: PairConfigData;
    configB: PairConfigData;
    statsA: PairStatsData;
    statsB: PairStatsData;
  }>;
  type: OrderType;
}

export default (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const { isMobile } = useBreakpoints();

  const populatePair = (a: JupTokenData, b: JupTokenData) =>
    populatePairByType<JupTokenData>(a, b, props.type);

  const pair = andMap(
    ([c, d]) => populatePair(c, d),
    combine2([of(props.a), of(props.b)])
  );

  const tokenPairPrice = usePrice(
    withDefault(
      undefined,
      andMap(
        ([p]) => ({ id: p[0].address, vsToken: p[1].address }),
        combine2([pair, of(open ? true : undefined)]) // Nothing unless open
      )
    ),
    refreshEach(REFRESH_INTERVAL)
  );

  const mints = withDefault(
    undefined,
    andMap(
      ([c, d]) => [
        {
          contract_address: c.address,
          symbol: c.symbol,
          name: c.name,
          imageSmall: c.logoURI,
        },
        {
          contract_address: d.address,
          symbol: d.symbol,
          name: d.name,
          imageSmall: d.logoURI,
        },
      ],
      pair
    )
  );

  const stats = withDefault(
    undefined,
    andMap((d) => {
      const { orderVolume: o, settleVolume: s, tradeVolume: t } = d;

      return {
        orderVolume: formatPrice(o),
        settleVolume: formatPrice(s),
        tradeVolume: formatPrice(t),
      };
    }, andMap(populateStats, of(props.tokenPair)))
  );

  const price = withDefault(undefined, of(tokenPairPrice.data));

  return (
    <>
      <Styled.Info pt={2} mb={!open && isMobile ? "56px" : undefined}>
        <Stack direction="row" spacing="1">
          <Box mr={1} mt={0.25}>
            <IntervalProgress
              interval={open ? REFRESH_INTERVAL : 0}
              refresh={tokenPairPrice.isValidating}
            />
          </Box>
          <Box>Token Pair Info</Box>
          <Styled.Toggle onClick={() => setOpen(!open)}>
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Styled.Toggle>
        </Stack>
      </Styled.Info>
      {!open ? null : (
        <Box pt={2}>
          <Grid container spacing={1}>
            <Grid item>
              <Styled.DetailsPair direction="row" spacing={2}>
                <PairCardSymbols data={mints} />
                <Typography variant="h6">
                  {!price ? "-" : formatPrice(price)}
                </Typography>
              </Styled.DetailsPair>
            </Grid>
          </Grid>
          <List>
            <Styled.DetailsItem>
              <Typography variant="body2">Order volume</Typography>
              <Typography variant="body2">
                {stats?.orderVolume ?? "-"}
              </Typography>
            </Styled.DetailsItem>
            <Styled.DetailsItem>
              <Typography variant="body2">Settle volume</Typography>
              <Typography variant="body2">
                {stats?.settleVolume ?? "-"}
              </Typography>
            </Styled.DetailsItem>
            <Styled.DetailsItem>
              <Typography variant="body2">Trade volume</Typography>
              <Typography variant="body2">
                {stats?.tradeVolume ?? "-"}
              </Typography>
            </Styled.DetailsItem>
          </List>
        </Box>
      )}
    </>
  );
};
