'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSimpleWallet } from '@/hooks/useSimpleWallet'
import { formatAddress } from '@/lib/utils'
import { Wallet, LogOut, User, AlertCircle, ExternalLink } from 'lucide-react'

export function WalletConnect() {
  const { isConnected, account, connect, disconnect, isLoading, error } = useSimpleWallet()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()
    } catch (error) {
      console.error('Connection failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Wallet Error
          </CardTitle>
          <CardDescription>
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              Please make sure you have VeWorld wallet installed and try again.
            </p>
          </div>
          <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            {isConnecting ? 'Connecting...' : 'Retry Connection'}
          </Button>
          <Button variant="outline" asChild className="w-full">
            <a href="https://veworld.net/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Install VeWorld Wallet
            </a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet (Demo Mode)
          </CardTitle>
          <CardDescription>
            Demo mode: Connect to explore the platform features. In production, this will connect to VeWorld wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet (Demo)'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Wallet Connected
        </CardTitle>
        <CardDescription>
          You're connected to VeChain Quora
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <p className="text-sm font-medium">Connected Address</p>
            <p className="text-sm text-muted-foreground font-mono">
              {formatAddress(account!)}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={disconnect}
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </Button>
      </CardContent>
    </Card>
  )
}
