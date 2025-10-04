'use client';

import { VeChainKitProvider } from "@vechain/vechain-kit";

export function VeChainKitProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <VeChainKitProvider
      // Network Configuration - VeChain Testnet
      network={{
        type: "test",
      }}
      
      // Login Methods Configuration - Self-custody wallets only
      loginMethods={[
        { method: "dappkit", gridColumn: 4 },
      ]}
      
      // DApp Kit Configuration
      dappKit={{
        allowedWallets: ["veworld", "sync2"],
      }}
      
      // UI Configuration
      darkMode={false}
      language="en"
    >
      {children}
    </VeChainKitProvider>
  );
}