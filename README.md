# Coffee Review & Rating System

A comprehensive, production-ready coffee e-commerce platform with an advanced review and rating system. Built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

### Customer Review System
- ⭐ **5-Star Rating System** - Intuitive star rating with visual feedback
- 📝 **Detailed Reviews** - Rich text reviews with title and content
- 📸 **Photo Uploads** - Upload up to 5 photos per review (brewing setup, coffee shots, etc.)
- ✅ **Verified Purchase Badges** - Automatic verification for customers who purchased the product
- 👍 **Helpful Voting** - Upvote/downvote reviews to highlight the most useful ones
- 🔒 **Review Moderation** - Admin panel for approving/rejecting reviews
- 📊 **Rating Analytics** - Comprehensive rating statistics and distribution charts
- 🔍 **SEO Optimized** - Structured data (JSON-LD) for rich snippets in search results

### Additional Features
- 🔐 **Authentication** - Secure user authentication with NextAuth.js
- 👤 **User Profiles** - Customer accounts with order history
- 🛒 **Product Catalog** - Browse premium specialty coffee
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🎨 **Modern UI** - Clean interface with Tailwind CSS
- 🚀 **Performance Optimized** - Image optimization, lazy loading, caching

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Image Processing**: Sharp
- **Icons**: Lucide React
- **Validation**: Zod
- **Date Formatting**: date-fns

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- npm or yarn package manager

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd coffee
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Create a PostgreSQL database:

```bash
createdb coffee_reviews
```

### 4. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and update the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/coffee_reviews?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/webp"
UPLOAD_DIR="./public/uploads"

# App Configuration
APP_NAME="Coffee Review System"
APP_URL="http://localhost:3000"

# Admin
ADMIN_EMAIL="admin@coffee.com"
```

### 5. Database Migration

Run Prisma migrations to create the database schema:

```bash
npx prisma db push
```

### 6. Seed Database (Optional)

Populate the database with sample data:

```bash
npm run db:seed
```

This creates:
- Admin user: `admin@coffee.com` / `admin123`
- Customer user: `customer@test.com` / `customer123`
- 5 sample coffee products
- Sample reviews

### 7. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
coffee/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding script
├── public/
│   └── uploads/               # User-uploaded images
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── reviews/       # Review CRUD operations
│   │   │   ├── upload/        # File upload endpoint
│   │   │   ├── admin/         # Admin endpoints
│   │   │   └── products/      # Product endpoints
│   │   ├── products/          # Product pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── StarRating.tsx     # Star rating component
│   │   ├── ReviewForm.tsx     # Review submission form
│   │   ├── ReviewItem.tsx     # Individual review display
│   │   ├── ReviewList.tsx     # Reviews list with pagination
│   │   ├── RatingsSummary.tsx # Rating statistics
│   │   ├── Navigation.tsx     # Navigation bar
│   │   └── ProductStructuredData.tsx  # SEO structured data
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client
│   │   ├── file-upload.ts     # File upload utilities
│   │   └── seo.ts             # SEO utilities
│   └── types/
│       └── next-auth.d.ts     # TypeScript type definitions
├── .env.example               # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Key Features Documentation

### Review System

#### Submitting a Review

1. Navigate to a product page
2. Click "Write a Review" (requires authentication)
3. Select star rating (1-5 stars)
4. Enter review title and content
5. Optionally upload up to 5 photos
6. Submit for moderation

#### Review Moderation

Admins can moderate reviews at `/admin`:

1. View all pending reviews
2. Approve or reject reviews
3. View review details and photos
4. Filter by status (Pending, Approved, Rejected)

#### Verified Purchase Badge

Reviews automatically receive a "Verified Purchase" badge if:
- The user has a delivered order containing the product
- The order is linked to the review

### Photo Uploads

- **Max file size**: 5MB per photo
- **Supported formats**: JPEG, PNG, WebP
- **Max photos per review**: 5
- **Auto-optimization**: Images are resized to 1200x1200px and compressed

### API Endpoints

#### Reviews

- `GET /api/reviews` - Get reviews (with filtering)
- `POST /api/reviews` - Create a review
- `GET /api/reviews/[id]` - Get a specific review
- `PUT /api/reviews/[id]` - Update a review
- `DELETE /api/reviews/[id]` - Delete a review
- `POST /api/reviews/[id]/vote` - Vote on a review (helpful/not helpful)
- `DELETE /api/reviews/[id]/vote` - Remove vote

#### Products

- `GET /api/products/[slug]/reviews/stats` - Get review statistics

#### Admin

- `GET /api/admin/reviews` - Get all reviews for moderation
- `PUT /api/admin/reviews/[id]/status` - Update review status

#### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

## Database Schema

### Key Models

- **User** - Customer and admin accounts
- **CoffeeProduct** - Coffee products catalog
- **Order** - Customer orders
- **OrderItem** - Order line items
- **Review** - Customer reviews
- **ReviewPhoto** - Review photos
- **ReviewVote** - Helpful/not helpful votes

See `prisma/schema.prisma` for the complete schema.

## Development

### Running Prisma Studio

View and edit database records in a browser:

```bash
npm run db:studio
```

### Type Checking

```bash
npx tsc --noEmit
```

### Building for Production

```bash
npm run build
npm start
```

## SEO Optimization

The system includes comprehensive SEO optimization:

1. **Structured Data**: JSON-LD schema for products and reviews
2. **Meta Tags**: Dynamic Open Graph and Twitter Card tags
3. **Rich Snippets**: Product ratings appear in search results
4. **Semantic HTML**: Proper heading hierarchy and ARIA labels

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based session management
- ✅ File upload validation (type, size)
- ✅ Image optimization to prevent malicious uploads
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Role-based access control

## Performance Optimizations

- Image optimization with Sharp
- Database query optimization with Prisma
- Pagination for reviews
- Lazy loading of images
- Client-side caching
- Server-side rendering (SSR)

## Deployment

### Environment Variables

Ensure all environment variables are configured in your production environment.

### Database Migration

Run migrations in production:

```bash
npx prisma migrate deploy
```

### Recommended Hosting

- **Frontend/Backend**: Vercel, Railway, or any Node.js hosting
- **Database**: Supabase, Railway, or any PostgreSQL provider
- **File Storage**: AWS S3, Cloudinary, or UploadThing (for production uploads)

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull
```

### Image Upload Issues

1. Ensure `public/uploads` directory exists
2. Check file permissions
3. Verify environment variables

### Authentication Issues

1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your domain
3. Clear browser cookies

## Future Enhancements

Potential features to add:
- Email notifications for review status
- Review replies from sellers
- Advanced filtering (roast level, origin, etc.)
- Subscription management
- Shopping cart functionality
- Payment processing
- Order tracking
- Coffee education content
- Roaster partnerships dashboard

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: admin@coffee.com

## Acknowledgments

- Coffee images and descriptions are for demonstration purposes
- Built with modern web technologies for optimal performance
- Designed with user experience and SEO best practices in mind

---

**Built with ☕ and 💙**
