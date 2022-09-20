import type { ReactNode } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default ({ children }: { children: ReactNode }) => {
  const { connected, publicKey } = useWallet();

  const isConnected = useMemo(
    () => Boolean(connected) && publicKey !== null,
    [connected, publicKey]
  );
  const address = useMemo(() => {
    if (!connected || publicKey === null) return undefined;

    return publicKey.toBase58();
  }, [connected, publicKey]);

  if (!isConnected || !address) {
    return (
      <Card sx={{ color: "#fff", backgroundColor: "transparent" }}>
        <CardContent>
          <Typography mb={1}>
            {!isConnected && "Select a wallet to add liquidity to the pool"}
            {!address && "Please choose any applicable wallet you gonna use"}
          </Typography>
          <WalletMultiButton />
        </CardContent>
      </Card>
    );
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
