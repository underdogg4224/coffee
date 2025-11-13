'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ThumbsUp, ThumbsDown, CheckCircle, Calendar, Image as ImageIcon } from 'lucide-react'
import { format } from 'date-fns'
import StarRating from './StarRating'
import Image from 'next/image'

interface Review {
  id: string
  rating: number
  title: string
  content: string
  verifiedPurchase: boolean
  helpfulCount: number
  notHelpfulCount: number
  createdAt: string
  user: {
    id: string
    name: string
    avatar: string | null
  }
  photos: {
    id: string
    photoUrl: string
    caption: string | null
  }[]
  votes?: {
    userId: string
    isHelpful: boolean
  }[]
}

interface ReviewItemProps {
  review: Review
  onVote?: () => void
}

export default function ReviewItem({ review, onVote }: ReviewItemProps) {
  const { data: session } = useSession()
  const [userVote, setUserVote] = useState<boolean | null>(() => {
    if (!session?.user?.id || !review.votes) return null
    const vote = review.votes.find((v) => v.userId === session.user.id)
    return vote ? vote.isHelpful : null
  })
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount)
  const [notHelpfulCount, setNotHelpfulCount] = useState(review.notHelpfulCount)
  const [isVoting, setIsVoting] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const handleVote = async (isHelpful: boolean) => {
    if (!session?.user) {
      alert('Please sign in to vote on reviews')
      return
    }

    if (isVoting) return

    setIsVoting(true)

    try {
      // Same vote - remove it
      if (userVote === isHelpful) {
        const response = await fetch(`/api/reviews/${review.id}/vote`, {
          method: 'DELETE',
        })

        if (response.ok) {
          if (isHelpful) {
            setHelpfulCount(helpfulCount - 1)
          } else {
            setNotHelpfulCount(notHelpfulCount - 1)
          }
          setUserVote(null)
        }
      } else {
        // New vote or change vote
        const response = await fetch(`/api/reviews/${review.id}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isHelpful }),
        })

        if (response.ok) {
          // Update counts
          if (userVote === null) {
            // New vote
            if (isHelpful) {
              setHelpfulCount(helpfulCount + 1)
            } else {
              setNotHelpfulCount(notHelpfulCount + 1)
            }
          } else {
            // Change vote
            if (isHelpful) {
              setHelpfulCount(helpfulCount + 1)
              setNotHelpfulCount(notHelpfulCount - 1)
            } else {
              setHelpfulCount(helpfulCount - 1)
              setNotHelpfulCount(notHelpfulCount + 1)
            }
          }
          setUserVote(isHelpful)
        }
      }

      onVote?.()
    } catch (error) {
      console.error('Vote error:', error)
      alert('Failed to record vote')
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="border-b border-gray-200 pb-6 last:border-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-coffee-200 rounded-full flex items-center justify-center text-coffee-700 font-semibold">
            {review.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{review.user.name}</h4>
              {review.verifiedPurchase && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                  <CheckCircle className="w-3 h-3" />
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-3 h-3" />
              {format(new Date(review.createdAt), 'MMMM d, yyyy')}
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} readonly size="sm" />
      </div>

      {/* Review Title */}
      <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>

      {/* Review Content */}
      <p className="text-gray-700 leading-relaxed mb-4">{review.content}</p>

      {/* Photos */}
      {review.photos.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {review.photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo.photoUrl)}
              className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-coffee-500 transition-colors"
            >
              <img
                src={photo.photoUrl}
                alt={photo.caption || 'Review photo'}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto}
              alt="Review photo"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Helpful Voting */}
      <div className="flex items-center gap-4 pt-4">
        <span className="text-sm text-gray-600">Was this review helpful?</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote(true)}
            disabled={isVoting}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors ${
              userVote === true
                ? 'bg-green-50 border-green-500 text-green-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm font-medium">Yes ({helpfulCount})</span>
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={isVoting}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors ${
              userVote === false
                ? 'bg-red-50 border-red-500 text-red-700'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="text-sm font-medium">No ({notHelpfulCount})</span>
          </button>
        </div>
      </div>
    </div>
  )
}
