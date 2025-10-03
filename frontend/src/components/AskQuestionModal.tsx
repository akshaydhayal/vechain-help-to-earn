'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Coins, Tag } from 'lucide-react'

interface AskQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { title: string; content: string; tags: string[]; bounty: string }) => void
}

export function AskQuestionModal({ isOpen, onClose, onSubmit }: AskQuestionModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [bounty, setBounty] = useState('0.1')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) return
    
    setIsSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags,
        bounty
      })
      
      // Reset form
      setTitle('')
      setContent('')
      setTagInput('')
      setTags([])
      setBounty('0.1')
      onClose()
    } catch (error) {
      console.error('Error submitting question:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      addTag()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Ask a Question
              </CardTitle>
              <CardDescription>
                Ask a question and offer a VET bounty for the best answer
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Question Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your question?"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            {/* Question Content */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Question Details *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Provide more details about your question..."
                className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={6}
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag (e.g., vechain, smart-contracts)"
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Bounty */}
            <div>
              <label className="block text-sm font-medium mb-2">
                VET Bounty
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    value={bounty}
                    onChange={(e) => setBounty(e.target.value)}
                    placeholder="0.1"
                    min="0"
                    step="0.01"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Coins className="h-4 w-4" />
                  VET
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                The bounty will be paid to the best answer when approved
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!title.trim() || !content.trim() || isSubmitting}
              >
                {isSubmitting ? 'Asking Question...' : 'Ask Question'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}