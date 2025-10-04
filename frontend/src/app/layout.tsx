import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientOnlyVeChainKit } from '@/components/ClientOnlyVeChainKit'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VeChain Quora - X-to-Earn Q&A Platform',
  description: 'A decentralized Q&A platform built on VeChain blockchain that rewards users for asking quality questions and providing helpful answers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientOnlyVeChainKit>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </ClientOnlyVeChainKit>
      </body>
    </html>
  )
}
