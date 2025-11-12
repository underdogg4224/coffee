import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { ShoppingCart, Package, Truck, Award } from 'lucide-react'
import RatingsSummary from '@/components/RatingsSummary'
import ReviewList from '@/components/ReviewList'
import ReviewForm from '@/components/ReviewForm'
import ProductStructuredData from '@/components/ProductStructuredData'
import { generateProductSEO } from '@/lib/seo'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const session = await getServerSession(authOptions)

  const product = await prisma.coffeeProduct.findUnique({
    where: { slug: params.slug },
    include: {
      reviews: {
        where: { status: 'APPROVED' },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          photos: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  // Calculate review statistics for SEO
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0

  // Check if user can review (has purchased and not already reviewed)
  let canReview = false
  let userOrder = null

  if (session?.user) {
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: product.id,
      },
    })

    if (!existingReview) {
      userOrder = await prisma.order.findFirst({
        where: {
          userId: session.user.id,
          status: 'DELIVERED',
          items: {
            some: {
              productId: product.id,
            },
          },
        },
      })

      canReview = true // Allow reviews even without purchase (will show as unverified)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Structured Data */}
      <ProductStructuredData
        product={product as any}
        reviews={product.reviews as any}
        averageRating={avgRating}
        totalReviews={product.reviews.length}
      />

      {/* Product Detail Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-white rounded-xl overflow-hidden border border-gray-200 mb-4">
              {product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="w-24 h-24" />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-coffee-600">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-gray-600">/ {product.weight}g</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-coffee-50 p-4 rounded-lg">
                <div className="text-sm text-coffee-600 font-medium mb-1">Origin</div>
                <div className="text-lg font-semibold text-gray-900">{product.origin}</div>
              </div>
              <div className="bg-coffee-50 p-4 rounded-lg">
                <div className="text-sm text-coffee-600 font-medium mb-1">Roast Level</div>
                <div className="text-lg font-semibold text-gray-900">{product.roastLevel}</div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-8">
              {product.description}
            </p>

            {product.roasterName && (
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
                <Award className="w-4 h-4" />
                <span>Roasted by {product.roasterName}</span>
              </div>
            )}

            <div className="space-y-4">
              <button className="w-full bg-coffee-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-coffee-700 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>{product.stock} in stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-8">
          {/* Ratings Summary */}
          <RatingsSummary productSlug={params.slug} />

          {/* Write Review */}
          {session?.user && canReview && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Write a Review
              </h3>
              <ReviewForm
                productId={product.id}
                orderId={userOrder?.id}
              />
            </div>
          )}

          {!session?.user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-800">
                <a href="/auth/signin" className="font-semibold underline">
                  Sign in
                </a>{' '}
                to write a review
              </p>
            </div>
          )}

          {/* Reviews List */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Customer Reviews
            </h3>
            <ReviewList productId={product.id} initialReviews={product.reviews as any} />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.coffeeProduct.findUnique({
    where: { slug: params.slug },
    include: {
      reviews: {
        where: { status: 'APPROVED' },
      },
    },
  })

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0

  const stats = {
    totalReviews: product.reviews.length,
    averageRating: avgRating,
  }

  return generateProductSEO(product, product.reviews, stats)
}
