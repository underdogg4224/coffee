'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Coffee, ShoppingCart, User, LogOut, Settings } from 'lucide-react'

export default function Navigation() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-coffee-700">
            <Coffee className="w-6 h-6" />
            <span>Coffee Reviews</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/products"
              className="text-gray-700 hover:text-coffee-600 font-medium transition-colors"
            >
              Shop
            </Link>

            {session?.user ? (
              <>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-coffee-600 font-medium transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-coffee-600 font-medium transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-coffee-600 font-medium transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-coffee-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-coffee-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-coffee-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}

            <Link
              href="/cart"
              className="text-gray-700 hover:text-coffee-600 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
