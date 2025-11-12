export function generateProductSEO(product: any, reviews: any[], stats: any) {
  const averageRating = stats?.averageRating || 0
  const totalReviews = stats?.totalReviews || 0

  return {
    title: `${product.name} - ${totalReviews} Customer Reviews | Coffee Reviews`,
    description: `${product.description} Read ${totalReviews} verified customer reviews with an average rating of ${averageRating.toFixed(1)} stars. Shop premium coffee online.`,
    keywords: [
      product.name,
      'coffee',
      'specialty coffee',
      product.origin,
      product.roastLevel,
      'coffee reviews',
      'buy coffee online',
    ].join(', '),
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'product',
      images: product.images.map((img: string) => ({
        url: img,
        alt: product.name,
      })),
      siteName: 'Coffee Reviews',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.images,
    },
  }
}

export function generateReviewSEOMeta(review: any) {
  return {
    title: `${review.title} - Review by ${review.user.name}`,
    description: review.content.substring(0, 160),
    openGraph: {
      type: 'article',
      title: review.title,
      description: review.content,
      publishedTime: review.createdAt,
      authors: [review.user.name],
      images: review.photos.map((p: any) => p.photoUrl),
    },
  }
}
