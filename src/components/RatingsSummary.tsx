'use client'

import { useEffect, useState } from 'react'
import StarRating from './StarRating'
import { Star } from 'lucide-react'

interface RatingStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    rating: number
    count: number
  }[]
  verifiedPurchaseCount: number
  verifiedPurchasePercentage: number
}

interface RatingsSummaryProps {
  productSlug: string
}

export default function RatingsSummary({ productSlug }: RatingsSummaryProps) {
  const [stats, setStats] = useState<RatingStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [productSlug])

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/products/${productSlug}/reviews/stats`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to load rating stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {stats.averageRating.toFixed(1)}
          </div>
          <StarRating rating={Math.round(stats.averageRating)} readonly size="lg" />
          <p className="text-sm text-gray-600 mt-2">
            Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
          </p>
          {stats.verifiedPurchasePercentage > 0 && (
            <p className="text-xs text-green-600 mt-1">
              {stats.verifiedPurchasePercentage}% verified purchases
            </p>
          )}
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {stats.ratingDistribution.map(({ rating, count }) => {
            const percentage =
              stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-coffee-600">
            {stats.verifiedPurchasePercentage}%
          </div>
          <div className="text-sm text-gray-600">Verified Purchases</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-coffee-600">
            {stats.totalReviews}
          </div>
          <div className="text-sm text-gray-600">Total Reviews</div>
        </div>
      </div>
    </div>
  )
}
