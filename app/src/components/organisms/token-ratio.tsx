import Box from "@mui/material/Box";
import { useCallback, useRef, useState } from "react";

import * as Styled from "./token-ratio.styled";
import CoinPopover from "./coin-popover";
import TokenPairForm from "../molecules/token-pair-form";
import { useCoinData } from "../../hooks/use-coin-data";
import { useTokenPairByMints } from "../../hooks/use-token-pair-by-mints";

export interface Props {}

export default function TokenRatio(props: Props) {
  const popoverRef = useRef<{ isOpened: boolean; open: () => void }>();

  const [curToken, setCurToken] = useState<number>();

  const onTokenAChoose = useCallback(() => {
    setCurToken(1);
    if (!popoverRef.current?.isOpened) popoverRef.current?.open();
  }, [popoverRef, setCurToken]);

  const onTokenBChoose = useCallback(() => {
    setCurToken(2);
    if (!popoverRef.current?.isOpened) popoverRef.current?.open();
  }, [popoverRef, setCurToken]);

  const onCoinSelect = useCallback(
    (symbol: string) => {
      console.log(curToken, symbol); // eslint-disable-line no-console
    },
    [curToken]
  );

  const initialTokenB = useCoinData({ id: "solana" });
  const initialTokenA = useCoinData({ id: "tether" });

  // const availableTokenPair = useTokenPairByMints(["solana", "tether"]);

  return (
    <>
      <CoinPopover ref={popoverRef} onChange={onCoinSelect} />
      <Styled.Swap elevation={1}>
        <Box p={2}>
          <TokenPairForm
            onASelect={onTokenAChoose}
            onBSelect={onTokenBChoose}
            tokenA={initialTokenA.data?.symbol}
            tokenAImage={initialTokenA.data?.image.small}
            tokenB={initialTokenB.data?.symbol}
            tokenBImage={initialTokenB.data?.image.small}
          />
        </Box>
      </Styled.Swap>
    </>
  );
}
