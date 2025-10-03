'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useVeChainKit } from '@/hooks/useVeChainKit'
import { formatAddress } from '@/lib/utils'
import { Wallet, LogOut, User } from 'lucide-react'

export function WalletConnect() {
  const { isConnected, account, connect, disconnect, isLoading } = useVeChainKit()

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

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your VeWorld Wallet
          </CardTitle>
          <CardDescription>
            Connect your VeWorld wallet to start asking questions, answering, and earning B3TR rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={connect} className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect VeWorld Wallet
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
