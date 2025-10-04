'use client';

import { VeChainKitProvider } from "@vechain/vechain-kit";

export function VeChainKitProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <VeChainKitProvider
      // Network Configuration - VeChain Testnet
      network={{
        type: "test", // "main" | "test" | "solo"
      }}
      
      // Fee Delegation (optional for now)
      feeDelegation={{
        delegatorUrl: "https://sponsor-testnet.vechain.energy/by/441",
        delegateAllTransactions: false, // Set to true to delegate all transactions
      }}
      
      // Login Methods Configuration - Self-custody wallets only
      loginMethods={[
        { method: "dappkit", gridColumn: 4 }, // VeChain wallets (VeWorld, Sync2, WalletConnect)
      ]}
      
      // DApp Kit Configuration
      dappKit={{
        allowedWallets: ["veworld", "wallet-connect", "sync2"],
        walletConnectOptions: {
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
          metadata: {
            name: "VeChain Quora",
            description: "X-to-Earn Q&A Platform on VeChain",
            url: typeof window !== "undefined" ? window.location.origin : "",
            icons: ["https://vechain.org/favicon.ico"],
          },
        },
      }}
      
      // UI Configuration
      darkMode={false}
      language="en"
      allowCustomTokens={false}
      
      // Login Modal UI Customization
      loginModalUI={{
        logo: '/vechain-logo.png',
        description: 'Welcome to VeChain Quora - X-to-Earn Q&A Platform',
      }}
    >
      {children}
    </VeChainKitProvider>
  );
}