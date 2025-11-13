interface Review {
  id: string
  rating: number
  title: string
  content: string
  verifiedPurchase: boolean
  createdAt: string
  user: {
    name: string
  }
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  slug: string
}

interface ProductStructuredDataProps {
  product: Product
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export default function ProductStructuredData({
  product,
  reviews,
  averageRating,
  totalReviews,
}: ProductStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products/${product.slug}`,
    },
    aggregateRating: totalReviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount: totalReviews,
      bestRating: '5',
      worstRating: '1',
    } : undefined,
    review: reviews.slice(0, 10).map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.user.name,
      },
      datePublished: review.createdAt,
      reviewBody: review.content,
      name: review.title,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: '5',
        worstRating: '1',
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
