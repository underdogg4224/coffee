import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Coffee, Star, ShoppingCart } from 'lucide-react'

export default async function HomePage() {
  const featuredProducts = await prisma.coffeeProduct.findMany({
    where: { featured: true },
    take: 6,
    include: {
      reviews: {
        where: { status: 'APPROVED' },
        select: { rating: true },
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-coffee-600 to-coffee-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Your Perfect Coffee
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-coffee-100">
              Premium specialty coffee from the world's best roasters
            </p>
            <Link
              href="#products"
              className="inline-block bg-white text-coffee-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-coffee-50 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coffee className="w-8 h-8 text-coffee-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Specialty Coffee
            </h3>
            <p className="text-gray-600">
              Carefully selected beans from premium roasters worldwide
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-coffee-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Verified Reviews
            </h3>
            <p className="text-gray-600">
              Real reviews from verified customers to help you choose
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-coffee-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fast Delivery
            </h3>
            <p className="text-gray-600">
              Free shipping on orders over $50, delivered to your door
            </p>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Featured Coffees
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => {
            const avgRating = product.reviews.length > 0
              ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
              : 0

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-200"
              >
                <div className="aspect-square bg-gray-100 relative">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Coffee className="w-24 h-24" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-coffee-600">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.reviews.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {avgRating.toFixed(1)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ({product.reviews.length})
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    {product.origin} • {product.roastLevel}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-coffee-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Our Coffee Community
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Share your brewing experiences, read reviews, and discover new favorites
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-coffee-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-coffee-700 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
