'use client';

import { useState, useEffect } from 'react';

// Create a context for wallet state
import { createContext, useContext } from 'react';

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  isVeWorldAvailable: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}

export function ClientOnlyVeChainKit({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVeWorldAvailable, setIsVeWorldAvailable] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if VeWorld is available
    if (typeof window !== 'undefined') {
      setIsVeWorldAvailable(!!window.vechain);
      
      // Check for existing connection
      const connected = localStorage.getItem('vechain-wallet-connected');
      const address = localStorage.getItem('vechain-wallet-address');
      if (connected === 'true' && address) {
        setAccount(address);
        setIsConnected(true);
      }
    }
  }, []);

  const connect = async () => {
    if (typeof window === 'undefined' || !window.vechain) {
      alert('VeWorld wallet is not installed. Please install VeWorld extension or use VeWorld mobile app.');
      return;
    }

    try {
      console.log('VeWorld object:', window.vechain);
      console.log('Available methods:', Object.keys(window.vechain));
      
      let result;
      
      // Method 1: Try direct connect (most common)
      if (window.vechain.connect) {
        console.log('Trying direct connect method...');
        result = await window.vechain.connect();
      }
      // Method 2: Try request method (EIP-1193 standard)
      else if (window.vechain.request) {
        console.log('Trying request method...');
        result = await window.vechain.request({ method: 'eth_requestAccounts' });
      }
      // Method 3: Try newConnexSigner without connect method
      else if (window.vechain.newConnexSigner) {
        console.log('Trying newConnexSigner method...');
        const signer = window.vechain.newConnexSigner('test');
        console.log('Signer object:', signer);
        console.log('Signer methods:', Object.keys(signer));
        
        // Try different signer methods
        if (signer.request) {
          result = await signer.request({ method: 'eth_requestAccounts' });
        } else if (signer.connect) {
          result = await signer.connect();
        } else if (signer.getAccount) {
          result = await signer.getAccount();
        } else {
          throw new Error('newConnexSigner returned object without expected methods');
        }
      }
      else {
        throw new Error('No compatible connection method found');
      }
      
      console.log('Connection result:', result);
      
      // Handle different response formats
      if (result && result.account) {
        setAccount(result.account);
        setIsConnected(true);
        localStorage.setItem('vechain-wallet-connected', 'true');
        localStorage.setItem('vechain-wallet-address', result.account);
      } else if (result && Array.isArray(result) && result.length > 0) {
        // Handle array response (EIP-1193 standard)
        setAccount(result[0]);
        setIsConnected(true);
        localStorage.setItem('vechain-wallet-connected', 'true');
        localStorage.setItem('vechain-wallet-address', result[0]);
      } else if (typeof result === 'string' && result.startsWith('0x')) {
        // Handle direct address response
        setAccount(result);
        setIsConnected(true);
        localStorage.setItem('vechain-wallet-connected', 'true');
        localStorage.setItem('vechain-wallet-address', result);
      } else {
        throw new Error('No account received from wallet');
      }
    } catch (error) {
      console.error('Failed to connect to VeWorld:', error);
      console.error('Error details:', error.message);
      alert(`Failed to connect to VeWorld wallet: ${error.message}. Please try again.`);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    
    // Clear localStorage
    localStorage.removeItem('vechain-wallet-connected');
    localStorage.removeItem('vechain-wallet-address');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <WalletContext.Provider value={{
      account,
      isConnected,
      connect,
      disconnect,
      isVeWorldAvailable
    }}>
      {children}
    </WalletContext.Provider>
  );
}