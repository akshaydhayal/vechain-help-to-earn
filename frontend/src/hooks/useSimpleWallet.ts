'use client'

import { useEffect, useState } from 'react'

export function useSimpleWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if already connected (from localStorage)
    const savedAccount = localStorage.getItem('vechain-quora-account')
    if (savedAccount) {
      setIsConnected(true)
      setAccount(savedAccount)
    }
  }, [])

  const connect = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate wallet connection for demo purposes
      const mockAccount = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsConnected(true)
      setAccount(mockAccount)
      localStorage.setItem('vechain-quora-account', mockAccount)
      
      return mockAccount
    } catch (error: any) {
      setError(error.message || 'Failed to connect wallet')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = async () => {
    setIsConnected(false)
    setAccount(null)
    setError(null)
    localStorage.removeItem('vechain-quora-account')
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
