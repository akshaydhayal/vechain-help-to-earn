'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

export function useVeChainKit() {
  const [provider, setProvider] = useState<ethers.Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initProvider = async () => {
      try {
        // Check if VeWorld wallet is available
        if (typeof window !== 'undefined' && (window as any).vechain) {
          const provider = new ethers.BrowserProvider((window as any).vechain)
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
            // Not connected
          }
        }
      } catch (error) {
        console.error('Failed to initialize provider:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initProvider()
  }, [])

  const connect = async () => {
    if (!provider) {
      throw new Error('VeWorld wallet not found. Please install VeWorld wallet.')
    }

    try {
      const accounts = await provider.send('eth_requestAccounts', [])
      if (accounts && accounts.length > 0) {
        setIsConnected(true)
        setAccount(accounts[0])
        setSigner(await provider.getSigner())
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  const disconnect = async () => {
    setIsConnected(false)
    setAccount(null)
    setSigner(null)
  }

  return {
    provider,
    signer,
    isConnected,
    account,
    isLoading,
    connect,
    disconnect,
  }
}
