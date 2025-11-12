'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import StarRating from './StarRating'

interface ReviewFormProps {
  productId: string
  orderId?: string
  onSuccess?: () => void
}

interface PhotoPreview {
  file: File
  preview: string
}

export default function ReviewForm({
  productId,
  orderId,
  onSuccess,
}: ReviewFormProps) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [photos, setPhotos] = useState<PhotoPreview[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (photos.length + files.length > 5) {
      setError('Maximum 5 photos allowed')
      return
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each photo must be less than 5MB')
        return false
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPEG, PNG, and WebP images are allowed')
        return false
      }
      return true
    })

    const newPhotos = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setPhotos([...photos, ...newPhotos])
    setError('')
  }

  const removePhoto = (index: number) => {
    const newPhotos = [...photos]
    URL.revokeObjectURL(newPhotos[index].preview)
    newPhotos.splice(index, 1)
    setPhotos(newPhotos)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    if (title.length < 5) {
      setError('Title must be at least 5 characters')
      return
    }

    if (content.length < 20) {
      setError('Review must be at least 20 characters')
      return
    }

    setIsSubmitting(true)

    try {
      // First, create a temporary review ID for uploads
      const tempReviewId = `temp-${Date.now()}`

      // Upload photos
      const photoUrls: string[] = []
      for (const photo of photos) {
        const formData = new FormData()
        formData.append('file', photo.file)
        formData.append('reviewId', tempReviewId)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          throw new Error('Failed to upload photo')
        }

        const uploadData = await uploadRes.json()
        photoUrls.push(uploadData.url)
      }

      // Create review
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          orderId,
          rating,
          title,
          content,
          photos: photoUrls,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit review')
      }

      // Clean up photo previews
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview))

      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <StarRating
          rating={rating}
          onRatingChange={setRating}
          size="lg"
          showLabel
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Review Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
          placeholder="Sum up your experience in a few words"
          maxLength={100}
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent resize-none"
          placeholder="Share your experience with this coffee. What did you like? How did you brew it? What flavors did you notice?"
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          {content.length} / 1000 characters (minimum 20)
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Photos (Optional)
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Share photos of your brewing setup, the coffee, or your cup. Maximum 5 photos, 5MB each.
        </p>

        <div className="space-y-4">
          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {photos.length < 5 && (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-coffee-500 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPEG, PNG or WebP (Max 5MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handlePhotoChange}
                disabled={photos.length >= 5}
              />
            </label>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t">
        <p className="text-xs text-gray-500">
          * Required fields
        </p>
        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="px-6 py-3 bg-coffee-600 text-white font-medium rounded-lg hover:bg-coffee-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>

      <p className="text-xs text-gray-500">
        By submitting this review, you agree that it meets our community guidelines.
        Reviews are moderated before publication.
      </p>
    </form>
  )
}
