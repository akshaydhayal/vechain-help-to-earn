'use client'

import { useEffect, useState } from 'react'

export function useDirectVeWorldWallet() {
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
        
        // Try different connection methods for VeWorld wallet
        let accounts = null
        
        // Method 1: Try eth_requestAccounts
        try {
          accounts = await wallet.request('eth_requestAccounts', [])
        } catch (e) {
          console.log('eth_requestAccounts failed, trying alternative methods')
        }
        
        // Method 2: Try wallet_requestPermissions
        if (!accounts) {
          try {
            const permissions = await wallet.request('wallet_requestPermissions', [{
              eth_accounts: {}
            }])
            if (permissions && permissions.length > 0) {
              accounts = await wallet.request('eth_accounts', [])
            }
          } catch (e) {
            console.log('wallet_requestPermissions failed, trying direct method')
          }
        }
        
        // Method 3: Try direct connection
        if (!accounts) {
          try {
            // Some VeWorld implementations use different method names
            if (typeof wallet.enable === 'function') {
              accounts = await wallet.enable()
            } else if (typeof wallet.request === 'function') {
              accounts = await wallet.request({ method: 'eth_requestAccounts' })
            }
          } catch (e) {
            console.log('Direct connection failed')
          }
        }
        
        if (accounts && accounts.length > 0) {
          setIsConnected(true)
          setAccount(accounts[0])
        } else {
          throw new Error('No accounts returned from wallet')
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
