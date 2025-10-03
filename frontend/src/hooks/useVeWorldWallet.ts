'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// VeWorld wallet interface
interface VeWorldWallet {
  request: (method: string, params?: any[]) => Promise<any>
  on: (event: string, callback: (data: any) => void) => void
  removeListener: (event: string, callback: (data: any) => void) => void
}

export function useVeWorldWallet() {
  const [provider, setProvider] = useState<ethers.Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [veWorldWallet, setVeWorldWallet] = useState<VeWorldWallet | null>(null)

  useEffect(() => {
    const initWallet = async () => {
      try {
        // Check if VeWorld wallet is available
        if (typeof window !== 'undefined' && (window as any).vechain) {
          const wallet = (window as any).vechain as VeWorldWallet
          setVeWorldWallet(wallet)
          
          // Create provider
          const provider = new ethers.BrowserProvider(wallet)
          setProvider(provider)
          
          // Check if already connected
          try {
            const accounts = await provider.listAccounts()
            if (accounts && accounts.length > 0) {
              setIsConnected(true)
              setAccount(accounts[0].address)
              setSigner(await provider.getSigner())
            }
          } catch (error) {
            // Not connected, this is normal
            console.log('Wallet not connected yet')
          }
        } else {
          setError('VeWorld wallet not found. Please install VeWorld wallet.')
        }
      } catch (error) {
        console.error('Failed to initialize wallet:', error)
        setError('Failed to initialize wallet connection')
      } finally {
        setIsLoading(false)
      }
    }

    initWallet()
  }, [])

  const connect = async () => {
    if (!veWorldWallet) {
      throw new Error('VeWorld wallet not found. Please install VeWorld wallet.')
    }

    try {
      setError(null)
      setIsLoading(true)
      
      // Use VeWorld specific connection method
      const accounts = await veWorldWallet.request('eth_requestAccounts', [])
      
      if (accounts && accounts.length > 0) {
        setIsConnected(true)
        setAccount(accounts[0])
        
        if (provider) {
          setSigner(await provider.getSigner())
        }
        
        return accounts[0]
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
    setIsConnected(false)
    setAccount(null)
    setSigner(null)
    setError(null)
  }

  // Listen for account changes
  useEffect(() => {
    if (veWorldWallet && isConnected) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else {
          setAccount(accounts[0])
        }
      }

      veWorldWallet.on('accountsChanged', handleAccountsChanged)
      
      return () => {
        veWorldWallet.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [veWorldWallet, isConnected])

  return {
    provider,
    signer,
    isConnected,
    account,
    isLoading,
    error,
    connect,
    disconnect,
  }
}
