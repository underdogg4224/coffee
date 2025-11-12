import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/[slug]/reviews/stats - Get review statistics for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.coffeeProduct.findUnique({
      where: { slug: params.slug },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get review statistics
    const [
      totalReviews,
      averageRating,
      ratingDistribution,
      verifiedPurchaseCount,
    ] = await Promise.all([
      // Total approved reviews
      prisma.review.count({
        where: {
          productId: product.id,
          status: 'APPROVED',
        },
      }),

      // Average rating
      prisma.review.aggregate({
        where: {
          productId: product.id,
          status: 'APPROVED',
        },
        _avg: {
          rating: true,
        },
      }),

      // Rating distribution (1-5 stars)
      Promise.all(
        [5, 4, 3, 2, 1].map(async (rating) => {
          const count = await prisma.review.count({
            where: {
              productId: product.id,
              status: 'APPROVED',
              rating,
            },
          })
          return { rating, count }
        })
      ),

      // Verified purchase count
      prisma.review.count({
        where: {
          productId: product.id,
          status: 'APPROVED',
          verifiedPurchase: true,
        },
      }),
    ])

    const stats = {
      totalReviews,
      averageRating: averageRating._avg.rating || 0,
      ratingDistribution,
      verifiedPurchaseCount,
      verifiedPurchasePercentage:
        totalReviews > 0
          ? Math.round((verifiedPurchaseCount / totalReviews) * 100)
          : 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Get review stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review statistics' },
      { status: 500 }
    )
  }
}
