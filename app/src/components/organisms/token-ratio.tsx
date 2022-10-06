import type { SWRResponse } from "swr";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { flatten } from "ramda";
import { useCallback, useMemo, useRef, useState } from "react";

import type { JupToken } from "../../hooks/use-jup-tokens";
import * as Styled from "./token-ratio.styled";
import CoinPopover from "./coin-popover";
import TokenPairForm from "../molecules/token-pair-form";
import { useTokenPair } from "../../hooks/use-token-pair-to-swap";

export interface Props {
  pairs: SWRResponse<Array<[string, string]>>;
}

export default function TokenRatio({ pairs }: Props) {
  const popoverRef = useRef<{ isOpened: boolean; open: () => void }>();

  const [curToken, setCurToken] = useState<number>();
  const [aToken, setAToken] = useState<JupToken>();
  const [bToken, setBToken] = useState<JupToken>();

  const selectedPair = useTokenPair(aToken && bToken && { aToken, bToken });

  const onTokenAChoose = useCallback(() => {
    setCurToken(1);
    if (!popoverRef.current?.isOpened) popoverRef.current?.open();
  }, [popoverRef, setCurToken]);

  const onTokenBChoose = useCallback(() => {
    setCurToken(2);
    if (!popoverRef.current?.isOpened) popoverRef.current?.open();
  }, [popoverRef, setCurToken]);

  const onCoinSelect = useCallback(
    (token: JupToken) => {
      if (curToken === 1) setAToken(token);
      if (curToken === 2) setBToken(token);
    },
    [curToken]
  );

  const availableTokens = useMemo(() => {
    if (!pairs.data) return undefined;

    return Array.from(new Set(flatten(pairs.data)).values());
  }, [pairs.data]);

  if (!pairs.data && !pairs.error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <CoinPopover
        onChange={onCoinSelect}
        ref={popoverRef}
        tokens={availableTokens}
      />
      <Styled.Swap elevation={1}>
        <Box p={2}>
          <TokenPairForm
            onASelect={onTokenAChoose}
            onBSelect={onTokenBChoose}
            tokenA={aToken?.symbol}
            tokenAImage={aToken?.logoURI}
            tokenAMint={aToken?.address}
            tokenB={bToken?.symbol}
            tokenBImage={bToken?.logoURI}
            tokenBMint={bToken?.address}
            tokenPair={selectedPair}
          />
        </Box>
      </Styled.Swap>
    </>
  );
}
