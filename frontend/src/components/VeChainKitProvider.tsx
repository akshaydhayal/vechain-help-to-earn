'use client'

import { VeChainKitProvider } from '@vechain/vechain-kit'
import { ReactNode } from 'react'

interface VeChainKitProviderWrapperProps {
  children: ReactNode
}

export function VeChainKitProviderWrapper({ children }: VeChainKitProviderWrapperProps) {
  return (
    <VeChainKitProvider
      network={{
        type: 'test',
        node: 'https://testnet.vechain.org',
        genesis: 'testnet',
      }}
      walletConnectOptions={{
        projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'YOUR_PROJECT_ID', // Replace with your actual project ID
        metadata: {
          name: 'VeChain Quora',
          description: 'X-to-Earn Q&A Platform on VeChain',
          url: 'https://vechain-quora.vercel.app',
          icons: ['https://vechain-quora.vercel.app/icon.png'],
        },
      }}
    >
      {children}
    </VeChainKitProvider>
  )
}
