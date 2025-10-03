'use client'

import { useEffect, useState } from 'react'

export function useSimpleVeWorldWallet() {
  const [mounted, setMounted] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    setIsLoading(false)
  }, [])

  const connect = async () => {
    if (!mounted) return

    try {
      setError(null)
      setIsLoading(true)
      
      // Check if VeWorld wallet is available
      if (typeof window !== 'undefined' && (window as any).vechain) {
        const wallet = (window as any).vechain
        
        // Request account access
        const accounts = await wallet.request('eth_requestAccounts', [])
        
        if (accounts && accounts.length > 0) {
          setIsConnected(true)
          setAccount(accounts[0])
        }
      } else {
        throw new Error('VeWorld wallet not found. Please install VeWorld wallet.')
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      setError(error.message || 'Failed to connect wallet')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = async () => {
    if (!mounted) return

    setIsConnected(false)
    setAccount(null)
    setError(null)
  }

  if (!mounted) {
    return {
      provider: null,
      signer: null,
      isConnected: false,
      account: null,
      isLoading: true,
      error: null,
      connect,
      disconnect,
    }
  }

  return {
    provider: null,
    signer: null,
    isConnected,
    account,
    isLoading,
    error,
    connect,
    disconnect,
  }
}


