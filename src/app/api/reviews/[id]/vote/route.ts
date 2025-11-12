import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const voteSchema = z.object({
  isHelpful: z.boolean(),
})

// POST /api/reviews/[id]/vote - Vote on a review (helpful/not helpful)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { isHelpful } = voteSchema.parse(body)

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: params.id },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Check if user already voted
    const existingVote = await prisma.reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId: params.id,
          userId: session.user.id,
        },
      },
    })

    let updatedReview

    if (existingVote) {
      // Update existing vote
      if (existingVote.isHelpful !== isHelpful) {
        await prisma.$transaction([
          prisma.reviewVote.update({
            where: {
              reviewId_userId: {
                reviewId: params.id,
                userId: session.user.id,
              },
            },
            data: { isHelpful },
          }),
          prisma.review.update({
            where: { id: params.id },
            data: {
              helpfulCount: existingVote.isHelpful
                ? { decrement: 1 }
                : { increment: 1 },
              notHelpfulCount: existingVote.isHelpful
                ? { increment: 1 }
                : { decrement: 1 },
            },
          }),
        ])
      }
    } else {
      // Create new vote
      await prisma.$transaction([
        prisma.reviewVote.create({
          data: {
            reviewId: params.id,
            userId: session.user.id,
            isHelpful,
          },
        }),
        prisma.review.update({
          where: { id: params.id },
          data: {
            helpfulCount: isHelpful ? { increment: 1 } : undefined,
            notHelpfulCount: !isHelpful ? { increment: 1 } : undefined,
          },
        }),
      ])
    }

    // Get updated review
    updatedReview = await prisma.review.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        helpfulCount: true,
        notHelpfulCount: true,
      },
    })

    return NextResponse.json({
      message: 'Vote recorded successfully',
      review: updatedReview,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Vote error:', error)
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })
  }
}

// DELETE /api/reviews/[id]/vote - Remove vote
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingVote = await prisma.reviewVote.findUnique({
      where: {
        reviewId_userId: {
          reviewId: params.id,
          userId: session.user.id,
        },
      },
    })

    if (!existingVote) {
      return NextResponse.json({ error: 'Vote not found' }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.reviewVote.delete({
        where: {
          reviewId_userId: {
            reviewId: params.id,
            userId: session.user.id,
          },
        },
      }),
      prisma.review.update({
        where: { id: params.id },
        data: {
          helpfulCount: existingVote.isHelpful ? { decrement: 1 } : undefined,
          notHelpfulCount: !existingVote.isHelpful ? { decrement: 1 } : undefined,
        },
      }),
    ])

    return NextResponse.json({ message: 'Vote removed successfully' })
  } catch (error) {
    console.error('Remove vote error:', error)
    return NextResponse.json(
      { error: 'Failed to remove vote' },
      { status: 500 }
    )
  }
}
