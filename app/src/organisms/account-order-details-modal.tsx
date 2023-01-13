import type { PublicKey } from "@solana/web3.js";
import type { BN } from "@project-serum/anchor";
import Maybe, { Extra } from "easy-maybe/lib";
import Stack from "@mui/material/Stack";
import { useCallback } from "react";

import type { MaybeTokens } from "../hooks/use-tokens-by-mint";
import * as Styled from "./account-order-details-modal.styled";
import Control from "../atoms/account-orders-details-control";
import Loading from "../atoms/loading";
import PairCardSymbols from "../atoms/pair-card-symbols";
import Stats from "../atoms/account-orders-details-stats";
import useBreakpoints from "../hooks/use-breakpoints";
import usePoolDetails from "../hooks/use-pool-details";
import useTokenPairByPool from "../hooks/use-token-pair-by-pool";
import useTokensByMint from "../hooks/use-tokens-by-mint";

const Content = ({
  details,
  onCancelOrder,
  tokens,
}: {
  details: PoolDetails;
  onCancelOrder: () => void;
  tokens: Voidable<MaybeTokens>;
}) => (
  <Stack direction="column" spacing={2}>
    <Styled.ContentHeader>
      <PairCardSymbols data={tokens} />
    </Styled.ContentHeader>
    <Stats details={details} />
    <Control
      expired={details.expired}
      inactive={details.inactive}
      onClick={onCancelOrder}
    />
  </Stack>
);

export default ({
  order,
  poolAddress,
  onCancel,
  side,
  supply,
}: {
  poolAddress: PublicKey;
  onCancel: (arg0: CancelOrderData) => void;
  order: OrderBalanceData;
  side: OrderTypeStruct;
  supply: BN;
}) => {
  const details = usePoolDetails(poolAddress, order);
  const data = Maybe.of(details.data);

  const tokenPair = useTokenPairByPool(poolAddress);
  const pairData = Maybe.of(tokenPair.data);

  const pairMints = Maybe.withDefault(
    undefined,
    Maybe.andMap<TokenPairProgramData, [PublicKey, PublicKey]>(
      (pair) => [pair.configA.mint, pair.configB.mint],
      pairData
    )
  );
  const tokens = useTokensByMint(pairMints);

  const { isMobile } = useBreakpoints();

  const onCancelOrder = useCallback(() => {
    Maybe.tap((d) => {
      const { aAddress, bAddress, expired, inactive, poolAddress: a } = d;

      onCancel({
        a: aAddress,
        b: bAddress,
        expired,
        inactive,
        orderAddress: order.address,
        poolAddress: a,
        side,
        supply,
      });
    }, data);
  }, [data, onCancel, order, side, supply]);

  if (details.isLoading || Extra.isNothing(data)) return <Loading />;

  const d = Extra.forkJust(data);

  if (isMobile)
    return (
      <Styled.MobileContainer>
        <Content
          details={d}
          onCancelOrder={onCancelOrder}
          tokens={tokens.data}
        />
      </Styled.MobileContainer>
    );

  return (
    <Styled.Container>
      <Content details={d} tokens={tokens.data} onCancelOrder={onCancelOrder} />
    </Styled.Container>
  );
};
