'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function WalletDebug() {
  const [walletInfo, setWalletInfo] = useState<any>(null)
  const [isVeWorldAvailable, setIsVeWorldAvailable] = useState(false)

  useEffect(() => {
    const checkWallet = () => {
      if (typeof window !== 'undefined') {
        const vechain = (window as any).vechain
        setIsVeWorldAvailable(!!vechain)
        
        if (vechain) {
          setWalletInfo({
            isVeWorld: true,
            methods: Object.keys(vechain),
            request: typeof vechain.request === 'function',
            enable: typeof vechain.enable === 'function',
            isConnected: typeof vechain.isConnected === 'function' ? vechain.isConnected() : 'unknown',
            selectedAddress: vechain.selectedAddress || 'none',
            chainId: vechain.chainId || 'none',
            isMetaMask: vechain.isMetaMask || false,
            isVeWorld: vechain.isVeWorld || false
          })
        }
      }
    }

    checkWallet()
    
    // Check again after a delay in case wallet loads asynchronously
    const timer = setTimeout(checkWallet, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Wallet Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <strong>VeWorld Available:</strong> {isVeWorldAvailable ? '✅ Yes' : '❌ No'}
          </div>
          {walletInfo && (
            <>
              <div>
                <strong>Wallet Type:</strong> {walletInfo.isVeWorld ? 'VeWorld' : 'Unknown'}
              </div>
              <div>
                <strong>Has Request Method:</strong> {walletInfo.request ? '✅ Yes' : '❌ No'}
              </div>
              <div>
                <strong>Has Enable Method:</strong> {walletInfo.enable ? '✅ Yes' : '❌ No'}
              </div>
              <div>
                <strong>Is Connected:</strong> {walletInfo.isConnected}
              </div>
              <div>
                <strong>Selected Address:</strong> {walletInfo.selectedAddress}
              </div>
              <div>
                <strong>Chain ID:</strong> {walletInfo.chainId}
              </div>
              <div>
                <strong>Is MetaMask:</strong> {walletInfo.isMetaMask ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Available Methods:</strong> {walletInfo.methods?.join(', ') || 'None'}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
