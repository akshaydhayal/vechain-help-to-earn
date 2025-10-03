'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@vechain/vechain-kit'

export function useVeChainKitWallet() {
  const [mounted, setMounted] = useState(false)
  const { 
    connect, 
    disconnect, 
    isConnected, 
    account, 
    isLoading,
    error 
  } = useWallet()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return {
      provider: null,
      signer: null,
      isConnected: false,
      account: null,
      isLoading: true,
      error: null,
      connect: async () => {},
      disconnect: async () => {},
    }
  }

  return {
    provider: null, // VeChain Kit handles provider internally
    signer: null,   // VeChain Kit handles signer internally
    isConnected,
    account,
    isLoading,
    error,
    connect,
    disconnect,
  }
}
