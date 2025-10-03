'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  MessageCircle, 
  MessageSquare, 
  Coins, 
  TrendingUp,
  Award,
  Clock
} from 'lucide-react'

interface StatsCardProps {
  totalUsers: number
  totalQuestions: number
  totalAnswers: number
  totalRewards: number
}

export function StatsCard({ totalUsers, totalQuestions, totalAnswers, totalRewards }: StatsCardProps) {
  const stats = [
    {
      label: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Questions Asked',
      value: totalQuestions.toLocaleString(),
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Answers Given',
      value: totalAnswers.toLocaleString(),
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Rewards Distributed',
      value: `${(totalRewards / 1e18).toFixed(2)} VET`,
      icon: Coins,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+12% this week</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Additional stats component for user-specific information
interface UserStatsCardProps {
  questionsAsked: number
  answersGiven: number
  reputation: number
  pendingRewards: string
}

export function UserStatsCard({ 
  questionsAsked, 
  answersGiven, 
  reputation, 
  pendingRewards 
}: UserStatsCardProps) {
  const userStats = [
    {
      label: 'Questions Asked',
      value: questionsAsked,
      icon: MessageCircle,
      color: 'text-blue-600'
    },
    {
      label: 'Answers Given',
      value: answersGiven,
      icon: MessageSquare,
      color: 'text-green-600'
    },
    {
      label: 'Reputation',
      value: reputation,
      icon: Award,
      color: 'text-purple-600'
    },
    {
      label: 'Pending Rewards',
      value: `${(parseFloat(pendingRewards) / 1e18).toFixed(4)} VET`,
      icon: Coins,
      color: 'text-yellow-600'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Your Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {userStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center gap-1 mb-1`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <div className="text-lg font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
        
        {parseFloat(pendingRewards) > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <Coins className="h-4 w-4" />
              <span className="text-sm font-medium">
                You have pending rewards! Claim them to earn B3TR tokens.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}