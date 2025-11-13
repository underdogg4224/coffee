'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import StarRating from '@/components/StarRating'
import { format } from 'date-fns'

interface Review {
  id: string
  rating: number
  title: string
  content: string
  verifiedPurchase: boolean
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  product: {
    id: string
    name: string
    slug: string
  }
  photos: {
    id: string
    photoUrl: string
  }[]
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('PENDING')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user && session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR') {
      router.push('/')
    }
  }, [session, status, router])

  useEffect(() => {
    loadReviews()
  }, [filterStatus, page])

  const loadReviews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/admin/reviews?status=${filterStatus}&page=${page}&limit=20`
      )
      const data = await response.json()
      setReviews(data.reviews)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateReviewStatus = async (reviewId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        loadReviews()
        setSelectedReview(null)
      }
    } catch (error) {
      console.error('Failed to update review status:', error)
      alert('Failed to update review status')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Review Moderation
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status)
                setPage(1)
              }}
              className={`p-6 rounded-lg border-2 transition-colors ${
                filterStatus === status
                  ? 'bg-white border-coffee-500'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {status}
                </span>
                {status === 'PENDING' && <Clock className="w-5 h-5 text-yellow-500" />}
                {status === 'APPROVED' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {status === 'REJECTED' && <XCircle className="w-5 h-5 text-red-500" />}
              </div>
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No {filterStatus.toLowerCase()} reviews
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <StarRating rating={review.rating} readonly size="sm" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {review.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {review.content}
                            </p>
                            {review.photos.length > 0 && (
                              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                                <ImageIcon className="w-4 h-4" />
                                {review.photos.length} photo{review.photos.length > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {review.product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {review.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {review.user.email}
                        </div>
                        {review.verifiedPurchase && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                            Verified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {format(new Date(review.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedReview(review)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {review.status !== 'APPROVED' && (
                            <button
                              onClick={() => updateReviewStatus(review.id, 'APPROVED')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {review.status !== 'REJECTED' && (
                            <button
                              onClick={() => updateReviewStatus(review.id, 'REJECTED')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedReview.title}
                  </h2>
                  <div className="flex items-center gap-4">
                    <StarRating rating={selectedReview.rating} readonly size="md" />
                    <span className="text-sm text-gray-600">
                      {format(new Date(selectedReview.createdAt), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Product</h3>
                  <p className="text-gray-700">{selectedReview.product.name}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Customer</h3>
                  <p className="text-gray-700">
                    {selectedReview.user.name} ({selectedReview.user.email})
                  </p>
                  {selectedReview.verifiedPurchase && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                      Verified Purchase
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Review</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedReview.content}
                  </p>
                </div>

                {selectedReview.photos.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Photos</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedReview.photos.map((photo) => (
                        <img
                          key={photo.id}
                          src={photo.photoUrl}
                          alt="Review photo"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                {selectedReview.status !== 'APPROVED' && (
                  <button
                    onClick={() => updateReviewStatus(selectedReview.id, 'APPROVED')}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Approve Review
                  </button>
                )}
                {selectedReview.status !== 'REJECTED' && (
                  <button
                    onClick={() => updateReviewStatus(selectedReview.id, 'REJECTED')}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Reject Review
                  </button>
                )}
                {selectedReview.status !== 'PENDING' && (
                  <button
                    onClick={() => updateReviewStatus(selectedReview.id, 'PENDING')}
                    className="flex-1 bg-yellow-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                  >
                    Mark as Pending
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
