import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { StrictMode } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";

import "../styles/globals.css";
import createEmotionCache from "../src/emotion-cache";
import { BlockchainConnectionProvider } from "../src/contexts/solana-connection-context";
import { CoingeckoApiProvider } from "../src/contexts/coingecko-api-context";
import { NotificationProvider } from "../src/contexts/notification-context";
import { ThemeProvider } from "../src/contexts/theme-context";
import { WalletProvider } from "../src/contexts/wallet-context";

const clientSideEmotionCache = createEmotionCache();

interface PageProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: PageProps) => (
  <CacheProvider value={emotionCache}>
    <ThemeProvider>
      <StrictMode>
        <NotificationProvider>
          <CoingeckoApiProvider>
            <BlockchainConnectionProvider>
              <WalletProvider>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Component {...pageProps} />
              </WalletProvider>
            </BlockchainConnectionProvider>
          </CoingeckoApiProvider>
        </NotificationProvider>
      </StrictMode>
    </ThemeProvider>
  </CacheProvider>
);

export default App;
