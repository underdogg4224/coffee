'use client'

import { useState, useEffect } from 'react'
import ReviewItem from './ReviewItem'
import { ChevronDown } from 'lucide-react'

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
}

interface ReviewListProps {
  productId: string
  initialReviews?: Review[]
}

export default function ReviewList({ productId, initialReviews = [] }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [sortBy, setSortBy] = useState('createdAt')
  const [filterRating, setFilterRating] = useState<number | null>(null)

  useEffect(() => {
    loadReviews(1, true)
  }, [sortBy, filterRating])

  const loadReviews = async (pageNum: number, reset = false) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        productId,
        page: pageNum.toString(),
        limit: '10',
        sortBy,
        order: 'desc',
        status: 'APPROVED',
      })

      if (filterRating) {
        params.append('rating', filterRating.toString())
      }

      const response = await fetch(`/api/reviews?${params}`)
      const data = await response.json()

      if (reset) {
        setReviews(data.reviews)
      } else {
        setReviews([...reviews, ...data.reviews])
      }

      setHasMore(pageNum < data.pagination.totalPages)
      setPage(pageNum)
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = () => {
    loadReviews(page + 1)
  }

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter by:</label>
          <select
            value={filterRating || ''}
            onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
          >
            <option value="createdAt">Most Recent</option>
            <option value="helpfulCount">Most Helpful</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {reviews.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onVote={() => loadReviews(1, true)}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && reviews.length > 0 && (
        <div className="text-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-coffee-500 text-coffee-700 font-medium rounded-lg hover:bg-coffee-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Loading...' : 'Load More Reviews'}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
