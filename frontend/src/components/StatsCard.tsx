'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Users, DollarSign, Trophy } from 'lucide-react'

interface StatsCardProps {
  totalQuestions: number
  totalAnswers: number
  totalUsers: number
  totalRewards: number
}

export function StatsCard({ totalQuestions, totalAnswers, totalUsers, totalRewards }: StatsCardProps) {
  const stats = [
    {
      title: 'Questions',
      value: totalQuestions,
      icon: MessageCircle,
      description: 'Total questions asked'
    },
    {
      title: 'Answers',
      value: totalAnswers,
      icon: MessageCircle,
      description: 'Total answers provided'
    },
    {
      title: 'Users',
      value: totalUsers,
      icon: Users,
      description: 'Registered users'
    },
    {
      title: 'Rewards',
      value: totalRewards,
      icon: Trophy,
      description: 'B3TR tokens distributed'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
