'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WalletConnect } from '@/components/WalletConnect'
import { QuestionCard } from '@/components/QuestionCard'
import { AskQuestionModal } from '@/components/AskQuestionModal'
import { StatsCard } from '@/components/StatsCard'
import { useSimpleWallet } from '@/hooks/useSimpleWallet'
import { useContract } from '@/hooks/useContract'
import { Plus, Search, Filter, TrendingUp, Clock } from 'lucide-react'

export default function Home() {
  const { isConnected, account, provider, signer } = useSimpleWallet()
  const { mainContract, platformStats, getPlatformStats } = useContract(provider, signer)
  const [questions, setQuestions] = useState<any[]>([])
  const [showAskModal, setShowAskModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'trending' | 'latest'>('latest')

  useEffect(() => {
    if (isConnected) {
      getPlatformStats()
      // In a real app, you'd fetch questions from the contract
      // For now, we'll use mock data
      setQuestions([
        {
          id: 1,
          asker: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          title: 'How to optimize VeChain smart contracts for gas efficiency?',
          content: 'I\'m developing a DeFi protocol on VeChain and want to optimize my smart contracts for better gas efficiency. What are the best practices?',
          tags: ['vechain', 'smart-contracts', 'gas-optimization', 'defi'],
          timestamp: Date.now() / 1000 - 3600,
          bounty: '1000000000000000000', // 1 VET
          isResolved: false,
          approvedAnswer: '0x0000000000000000000000000000000000000000',
          totalAnswers: 3
        },
        {
          id: 2,
          asker: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
          title: 'What are the benefits of VeBetter DAO integration?',
          content: 'I want to integrate VeBetter DAO into my dApp. What are the main benefits and how do I get started?',
          tags: ['vebetter', 'dao', 'integration', 'rewards'],
          timestamp: Date.now() / 1000 - 7200,
          bounty: '2000000000000000000', // 2 VET
          isResolved: true,
          approvedAnswer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          totalAnswers: 5
        }
      ])
    }
  }, [isConnected, getPlatformStats])

  const handleAskQuestion = async (data: { title: string; content: string; tags: string[]; bounty: string }) => {
    if (!mainContract || !account) return

    try {
      const bountyWei = (parseFloat(data.bounty) * 1e18).toString()
      const tx = await mainContract.askQuestion(
        data.title,
        data.content,
        data.tags,
        { value: bountyWei }
      )
      await tx.wait()
      
      // Refresh questions
      console.log('Question asked successfully!')
    } catch (error) {
      console.error('Error asking question:', error)
    }
  }

  const handleViewQuestion = (questionId: number) => {
    // Navigate to question detail page
    console.log('View question:', questionId)
  }

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortBy === 'trending') {
      return b.totalAnswers - a.totalAnswers
    } else {
      return b.timestamp - a.timestamp
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary">VeChain Quora</h1>
              <span className="text-sm text-muted-foreground">X-to-Earn Q&A Platform</span>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        {isConnected && (
          <div className="mb-8">
            <StatsCard
              totalQuestions={platformStats.totalQuestions}
              totalAnswers={platformStats.totalAnswers}
              totalUsers={platformStats.totalUsers}
              totalRewards={platformStats.totalRewards}
            />
          </div>
        )}

        {/* Search and Filter */}
        {isConnected && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search questions, answers, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={sortBy === 'latest' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('latest')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Latest
                </Button>
                <Button
                  variant={sortBy === 'trending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('trending')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Trending
                </Button>
                <Button
                  onClick={() => setShowAskModal(true)}
                  className="ml-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ask Question
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Questions List */}
        {isConnected ? (
          <div className="space-y-4">
            {sortedQuestions.length > 0 ? (
              sortedQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onViewQuestion={handleViewQuestion}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'Try adjusting your search terms' : 'Be the first to ask a question!'}
                  </p>
                  <Button onClick={() => setShowAskModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ask Question
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Welcome to VeChain Quora</h2>
            <p className="text-muted-foreground mb-8">
              Connect your VeWorld wallet to start asking questions, answering, and earning B3TR rewards
            </p>
          </div>
        )}
      </main>

      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={showAskModal}
        onClose={() => setShowAskModal(false)}
        onSubmit={handleAskQuestion}
      />
    </div>
  )
}
