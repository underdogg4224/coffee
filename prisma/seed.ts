import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coffee.com' },
    update: {},
    create: {
      email: 'admin@coffee.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: true,
    },
  })

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 10)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      password: customerPassword,
      name: 'Test Customer',
      role: 'CUSTOMER',
      emailVerified: true,
    },
  })

  // Create sample coffee products
  const coffees = [
    {
      name: 'Ethiopian Yirgacheffe',
      description: 'A bright, floral coffee with notes of bergamot and blueberry. Light to medium body with a clean, sweet finish. Perfect for pour-over brewing.',
      price: 18.99,
      origin: 'Ethiopia',
      roastLevel: 'Light',
      weight: 340,
      roasterName: 'Artisan Coffee Co.',
      stock: 50,
      slug: 'ethiopian-yirgacheffe',
      images: ['/images/products/ethiopian-yirgacheffe.jpg'],
      featured: true,
    },
    {
      name: 'Colombian Supremo',
      description: 'Rich and balanced with caramel sweetness, medium body, and notes of chocolate and nuts. An excellent everyday coffee.',
      price: 15.99,
      origin: 'Colombia',
      roastLevel: 'Medium',
      weight: 340,
      roasterName: 'Mountain Peak Roasters',
      stock: 75,
      slug: 'colombian-supremo',
      images: ['/images/products/colombian-supremo.jpg'],
      featured: true,
    },
    {
      name: 'Sumatra Mandheling',
      description: 'Full-bodied and earthy with low acidity. Deep chocolate notes, herbal undertones, and a syrupy mouthfeel.',
      price: 16.99,
      origin: 'Indonesia',
      roastLevel: 'Dark',
      weight: 340,
      roasterName: 'Island Roast Coffee',
      stock: 40,
      slug: 'sumatra-mandheling',
      images: ['/images/products/sumatra-mandheling.jpg'],
      featured: false,
    },
    {
      name: 'Costa Rican Tarrazu',
      description: 'Crisp and clean with bright acidity. Notes of citrus, honey, and brown sugar. Grown at high altitude for complex flavor.',
      price: 17.99,
      origin: 'Costa Rica',
      roastLevel: 'Medium-Light',
      weight: 340,
      roasterName: 'Highland Coffee Roasters',
      stock: 60,
      slug: 'costa-rican-tarrazu',
      images: ['/images/products/costa-rican-tarrazu.jpg'],
      featured: false,
    },
    {
      name: 'Brazilian Santos',
      description: 'Smooth and mild with nutty, chocolatey flavors. Low acidity makes it perfect for espresso and cold brew.',
      price: 14.99,
      origin: 'Brazil',
      roastLevel: 'Medium',
      weight: 340,
      roasterName: 'Sunrise Coffee Company',
      stock: 80,
      slug: 'brazilian-santos',
      images: ['/images/products/brazilian-santos.jpg'],
      featured: true,
    },
  ]

  const createdProducts = []
  for (const coffee of coffees) {
    const product = await prisma.coffeeProduct.upsert({
      where: { slug: coffee.slug },
      update: {},
      create: coffee,
    })
    createdProducts.push(product)
    console.log(`✅ Created product: ${product.name}`)
  }

  // Create a sample order with delivered status
  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      totalPrice: 18.99,
      status: 'DELIVERED',
      items: {
        create: {
          productId: createdProducts[0].id,
          quantity: 1,
          price: 18.99,
        },
      },
    },
  })

  // Create sample reviews
  const reviews = [
    {
      userId: customer.id,
      productId: createdProducts[0].id,
      orderId: order.id,
      rating: 5,
      title: 'Absolutely Amazing!',
      content: 'This Ethiopian Yirgacheffe is hands down the best coffee I\'ve ever had. The floral notes are incredible, and it has such a clean finish. I brew it with my Chemex every morning, and it never disappoints. Will definitely order again!',
      verifiedPurchase: true,
      status: 'APPROVED',
      helpfulCount: 12,
      notHelpfulCount: 1,
    },
    {
      userId: customer.id,
      productId: createdProducts[1].id,
      orderId: null,
      rating: 4,
      title: 'Great Daily Coffee',
      content: 'Perfect for everyday drinking. Not too acidic, smooth flavor. Good value for money.',
      verifiedPurchase: false,
      status: 'APPROVED',
      helpfulCount: 5,
      notHelpfulCount: 0,
    },
    {
      userId: customer.id,
      productId: createdProducts[4].id,
      orderId: null,
      rating: 5,
      title: 'Perfect for Espresso',
      content: 'Makes excellent espresso shots with thick crema. Chocolatey and smooth without any bitterness. My go-to for morning lattes.',
      verifiedPurchase: false,
      status: 'APPROVED',
      helpfulCount: 8,
      notHelpfulCount: 2,
    },
  ]

  for (const reviewData of reviews) {
    await prisma.review.create({
      data: reviewData,
    })
  }

  console.log('✅ Created sample reviews')
  console.log('🎉 Seeding completed!')
  console.log('\n📝 Test Accounts:')
  console.log('Admin: admin@coffee.com / admin123')
  console.log('Customer: customer@test.com / customer123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
