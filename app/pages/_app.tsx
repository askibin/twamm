import type { AppProps } from "next/app";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { memo, StrictMode } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";

import "../styles/globals.css";
import theme from "../src/theme";
import createEmotionCache from "../src/emotion-cache";
import WalletProvider from "../src/contexts/wallet-context";
import { NotificationProvider } from "../src/contexts/notification-context";
import { BlockchainConnectionProvider } from "../src/contexts/solana-connection-context";
import { CoingeckoApiProvider } from "../src/contexts/coingecko-api-context";

const clientSideEmotionCache = createEmotionCache();

const BaselineMemo = memo(() => <CssBaseline enableColorScheme />);

interface PageProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: PageProps) => (
  <CacheProvider value={emotionCache}>
    <ThemeProvider theme={theme}>
      <BaselineMemo />
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
