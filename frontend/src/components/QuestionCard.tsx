'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatAddress } from '@/lib/utils'
import { 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  Clock, 
  User, 
  Coins,
  Eye,
  Reply
} from 'lucide-react'

interface QuestionCardProps {
  question: {
    id: number
    asker: string
    title: string
    content: string
    tags: string[]
    timestamp: number
    bounty: string
    isResolved: boolean
    approvedAnswer: string
    totalAnswers: number
  }
  onViewQuestion: (questionId: number) => void
  onAnswerQuestion?: (questionId: number) => void
  onUpvoteAnswer?: (questionId: number, answerId: number) => void
  onDownvoteAnswer?: (questionId: number, answerId: number) => void
  onApproveAnswer?: (questionId: number, answerId: number) => void
  currentUser?: string
}

export function QuestionCard({ 
  question, 
  onViewQuestion, 
  onAnswerQuestion,
  onUpvoteAnswer,
  onDownvoteAnswer,
  onApproveAnswer,
  currentUser
}: QuestionCardProps) {
  const [showAnswers, setShowAnswers] = useState(false)
  const [answers, setAnswers] = useState<any[]>([])
  const [newAnswer, setNewAnswer] = useState('')
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now() / 1000
    const diff = now - timestamp
    const hours = Math.floor(diff / 3600)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  const formatBounty = (bounty: string) => {
    const vet = parseFloat(bounty) / 1e18
    return `${vet.toFixed(2)} VET`
  }

  const handleAnswerSubmit = async () => {
    if (!newAnswer.trim() || !onAnswerQuestion) return
    
    setIsSubmittingAnswer(true)
    try {
      await onAnswerQuestion(question.id)
      setNewAnswer('')
      // In a real app, you'd refresh the answers here
    } catch (error) {
      console.error('Error submitting answer:', error)
    } finally {
      setIsSubmittingAnswer(false)
    }
  }

  const isAsker = currentUser && currentUser.toLowerCase() === question.asker.toLowerCase()

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{question.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <User className="h-4 w-4" />
              <span>{formatAddress(question.asker)}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{formatTimeAgo(question.timestamp)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {question.isResolved && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Resolved
              </Badge>
            )}
            <Badge variant="outline" className="flex items-center gap-1">
              <Coins className="h-3 w-3" />
              {formatBounty(question.bounty)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground mb-4">{question.content}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnswers(!showAnswers)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {question.totalAnswers} {question.totalAnswers === 1 ? 'Answer' : 'Answers'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewQuestion(question.id)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>

          {!question.isResolved && onAnswerQuestion && (
            <Button
              onClick={() => setShowAnswers(!showAnswers)}
              size="sm"
            >
              <Reply className="h-4 w-4 mr-2" />
              Answer
            </Button>
          )}
        </div>

        {/* Answers Section */}
        {showAnswers && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold mb-4">Answers ({question.totalAnswers})</h4>
            
            {/* Mock answers for demonstration */}
            {question.totalAnswers > 0 ? (
              <div className="space-y-4">
                {/* Mock answer 1 */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{formatAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')}</span>
                      <span className="text-xs text-muted-foreground">2h ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="ml-1">5</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsDown className="h-4 w-4" />
                        <span className="ml-1">1</span>
                      </Button>
                      {isAsker && (
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This is a sample answer to demonstrate the Q&A functionality. 
                    In a real implementation, this would be fetched from the smart contract.
                  </p>
                </div>

                {/* Mock answer 2 */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{formatAddress('0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063')}</span>
                      <span className="text-xs text-muted-foreground">1h ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4" />
                        <span className="ml-1">3</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsDown className="h-4 w-4" />
                        <span className="ml-1">0</span>
                      </Button>
                      {isAsker && (
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Another sample answer showing how multiple users can contribute to solving questions.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No answers yet. Be the first to answer!
              </p>
            )}

            {/* Answer Form */}
            {!question.isResolved && onAnswerQuestion && (
              <div className="mt-6 border-t pt-4">
                <h5 className="font-medium mb-3">Your Answer</h5>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full p-3 border rounded-lg resize-none"
                  rows={4}
                />
                <div className="flex justify-end mt-3">
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={!newAnswer.trim() || isSubmittingAnswer}
                    size="sm"
                  >
                    {isSubmittingAnswer ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}