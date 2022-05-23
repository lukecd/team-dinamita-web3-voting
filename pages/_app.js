import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, createClient, WagmiProvider } from "wagmi";
import { NextUIProvider } from "@nextui-org/react";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.polygonMumbai],
  [apiProvider.alchemy(process.env.ALCHEMY_ID), apiProvider.fallback()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

import { createTheme } from "@nextui-org/react"

const darkThemeNextUi = createTheme({
  type: 'dark',
  // theme: {
  //   colors: {...}, // override dark theme colors
  // }
});

function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider theme={ darkThemeNextUi}>
      <WagmiProvider client={wagmiClient}>
        <RainbowKitProvider coolMode chains={chains} theme={darkTheme()}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiProvider>
    </NextUIProvider>
  );
}

export default MyApp;
