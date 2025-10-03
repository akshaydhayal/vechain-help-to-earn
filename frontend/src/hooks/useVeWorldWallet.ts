'use client'

import { useWallet } from '@vechain/vechain-kit'
import { useEffect, useState } from 'react'

export function useVeWorldWallet() {
  const [mounted, setMounted] = useState(false)
  const { connect, disconnect, account, isConnected, isConnecting } = useWallet()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async () => {
    if (!mounted) return
    
    try {
      setError(null)
      await connect()
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      setError(error.message || 'Failed to connect wallet')
      throw error
    }
  }

  const handleDisconnect = async () => {
    if (!mounted) return
    
    try {
      setError(null)
      await disconnect()
    } catch (error: any) {
      console.error('Failed to disconnect wallet:', error)
      setError(error.message || 'Failed to disconnect wallet')
    }
  }

  if (!mounted) {
    return {
      provider: null,
      signer: null,
      isConnected: false,
      account: null,
      isLoading: true,
      error: null,
      connect: handleConnect,
      disconnect: handleDisconnect,
    }
  }

  return {
    provider: null, // VeChain Kit handles provider internally
    signer: null,   // VeChain Kit handles signer internally
    isConnected,
    account,
    isLoading: isConnecting,
    error,
    connect: handleConnect,
    disconnect: handleDisconnect,
  }
}