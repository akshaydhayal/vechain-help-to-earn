'use client'

import { useEffect, useState } from 'react'

export function useVeWorldWalletAdvanced() {
  const [mounted, setMounted] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    setIsLoading(false)
    
    // Check if wallet is already connected
    if (typeof window !== 'undefined' && (window as any).vechain) {
      const wallet = (window as any).vechain
      if (wallet.selectedAddress) {
        setIsConnected(true)
        setAccount(wallet.selectedAddress)
      }
    }
  }, [])

  const connect = async () => {
    if (!mounted) return

    try {
      setError(null)
      setIsLoading(true)
      
      // Check if VeWorld wallet is available
      if (typeof window !== 'undefined' && (window as any).vechain) {
        const wallet = (window as any).vechain
        
        console.log('VeWorld wallet detected:', wallet)
        console.log('Available methods:', Object.keys(wallet))
        
        let accounts = null
        
        // Method 1: Try the standard EIP-1193 approach
        try {
          console.log('Trying eth_requestAccounts...')
          accounts = await wallet.request({ method: 'eth_requestAccounts' })
          console.log('eth_requestAccounts result:', accounts)
        } catch (e) {
          console.log('eth_requestAccounts failed:', e.message)
        }
        
        // Method 2: Try the legacy enable method
        if (!accounts && typeof wallet.enable === 'function') {
          try {
            console.log('Trying enable method...')
            accounts = await wallet.enable()
            console.log('enable result:', accounts)
          } catch (e) {
            console.log('enable method failed:', e.message)
          }
        }
        
        // Method 3: Try direct method call
        if (!accounts && typeof wallet.request === 'function') {
          try {
            console.log('Trying direct request...')
            accounts = await wallet.request('eth_requestAccounts')
            console.log('direct request result:', accounts)
          } catch (e) {
            console.log('direct request failed:', e.message)
          }
        }
        
        // Method 4: Try wallet_requestPermissions
        if (!accounts) {
          try {
            console.log('Trying wallet_requestPermissions...')
            const permissions = await wallet.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }]
            })
            console.log('wallet_requestPermissions result:', permissions)
            
            if (permissions && permissions.length > 0) {
              accounts = await wallet.request({ method: 'eth_accounts' })
              console.log('eth_accounts result:', accounts)
            }
          } catch (e) {
            console.log('wallet_requestPermissions failed:', e.message)
          }
        }
        
        // Method 5: Check if already connected
        if (!accounts && wallet.selectedAddress) {
          console.log('Wallet already connected, using selectedAddress:', wallet.selectedAddress)
          accounts = [wallet.selectedAddress]
        }
        
        if (accounts && accounts.length > 0) {
          setIsConnected(true)
          setAccount(accounts[0])
          console.log('Successfully connected with account:', accounts[0])
        } else {
          throw new Error('No accounts returned from wallet. Please check if VeWorld wallet is unlocked and try again.')
        }
      } else {
        throw new Error('VeWorld wallet not found. Please install VeWorld wallet browser extension.')
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
