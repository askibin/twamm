import type { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import * as Styled from "./wallet-guard.styled";

export default ({ children }: { children: ReactNode }) => {
  const { connected, publicKey } = useWallet();

  const isConnected = useMemo(
    () => Boolean(connected) && publicKey !== null,
    [connected, publicKey]
  );
  const address = useMemo(
    () => (isConnected ? publicKey?.toBase58() : undefined),
    [publicKey, isConnected]
  );

  if (!isConnected || !address) {
    return (
      <Styled.Container elevation={0}>
        <Styled.Inner>
          <Typography mb={2}>
            {!isConnected && "Select a wallet to add liquidity to the pool"}
            {!address && "Please choose any applicable wallet you gonna use"}
          </Typography>
          <WalletMultiButton />
        </Styled.Inner>
      </Styled.Container>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
