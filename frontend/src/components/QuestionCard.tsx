'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatVET, getTimeAgo } from '@/lib/utils'
import { MessageCircle, Clock, DollarSign, User, CheckCircle } from 'lucide-react'
import { Question } from '@/hooks/useContract'

interface QuestionCardProps {
  question: Question
  onViewQuestion: (questionId: number) => void
}

export function QuestionCard({ question, onViewQuestion }: QuestionCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewQuestion(question.id)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{question.title}</CardTitle>
            <CardDescription className="mt-2 line-clamp-3">
              {question.content}
            </CardDescription>
          </div>
          {question.isResolved && (
            <CheckCircle className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{question.asker.slice(0, 6)}...{question.asker.slice(-4)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{getTimeAgo(question.timestamp)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">{formatVET(question.bounty)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{question.totalAnswers} answers</span>
            </div>
            <div className="flex gap-1">
              {question.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {question.tags.length > 3 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                  +{question.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
          <Button size="sm" variant="outline">
            View Question
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
