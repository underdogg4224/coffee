import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  orderId: z.string().optional().nullable(),
  rating: z.number().min(1).max(5),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Review must be at least 20 characters'),
  photos: z.array(z.string()).max(5, 'Maximum 5 photos allowed').optional(),
})

// GET /api/reviews - Get reviews with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status') || 'APPROVED'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const skip = (page - 1) * limit

    const where: any = {}

    if (productId) {
      where.productId = productId
    }

    if (userId) {
      where.userId = userId
    }

    if (status) {
      where.status = status
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
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
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createReviewSchema.parse(body)

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: validatedData.productId,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    // Check if this is a verified purchase
    let verifiedPurchase = false
    if (validatedData.orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: validatedData.orderId,
          userId: session.user.id,
          status: 'DELIVERED',
          items: {
            some: {
              productId: validatedData.productId,
            },
          },
        },
      })
      verifiedPurchase = !!order
    }

    // Create review with photos
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: validatedData.productId,
        orderId: validatedData.orderId,
        rating: validatedData.rating,
        title: validatedData.title,
        content: validatedData.content,
        verifiedPurchase,
        status: 'PENDING', // Reviews start as pending for moderation
        photos: validatedData.photos
          ? {
              create: validatedData.photos.map((url, index) => ({
                photoUrl: url,
                displayOrder: index,
              })),
            }
          : undefined,
      },
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(
      { message: 'Review submitted successfully', review },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
