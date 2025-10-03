'use client'

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

interface ClientOnlyVeChainKitProps {
  children: ReactNode
}

// Dynamically import VeChainKitProvider to avoid SSR issues
const VeChainKitProvider = dynamic(
  () => import('@vechain/vechain-kit').then((mod) => mod.VeChainKitProvider),
  { ssr: false }
)

export function ClientOnlyVeChainKit({ children }: ClientOnlyVeChainKitProps) {
  return (
    <VeChainKitProvider
      network={{
        type: 'test',
        node: 'https://testnet.vechain.org',
        genesis: 'testnet',
      }}
      walletConnectOptions={{
        projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'YOUR_PROJECT_ID',
        metadata: {
          name: 'VeChain Quora',
          description: 'X-to-Earn Q&A Platform on VeChain',
          url: 'https://vechain-quora.vercel.app',
          icons: ['https://vechain-quora.vercel.app/icon.png'],
        },
      }}
      logLevel="error"
    >
      {children}
    </VeChainKitProvider>
  )
}
