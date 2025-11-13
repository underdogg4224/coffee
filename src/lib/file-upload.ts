import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import sharp from 'sharp'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface UploadResult {
  url: string
  filename: string
  size: number
}

export async function uploadReviewPhoto(
  file: File,
  reviewId: string
): Promise<UploadResult> {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit.')
  }

  // Create upload directory if it doesn't exist
  const reviewDir = path.join(UPLOAD_DIR, 'reviews', reviewId)
  if (!existsSync(reviewDir)) {
    await mkdir(reviewDir, { recursive: true })
  }

  // Generate unique filename
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
  const filepath = path.join(reviewDir, filename)

  // Convert File to Buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Optimize image using sharp
  const optimizedBuffer = await sharp(buffer)
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85, progressive: true })
    .toBuffer()

  // Save file
  await writeFile(filepath, optimizedBuffer)

  const publicUrl = `/uploads/reviews/${reviewId}/${filename}`

  return {
    url: publicUrl,
    filename,
    size: optimizedBuffer.length,
  }
}

export async function uploadProductPhoto(
  file: File,
  productSlug: string
): Promise<UploadResult> {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit.')
  }

  // Create upload directory if it doesn't exist
  const productDir = path.join(UPLOAD_DIR, 'products', productSlug)
  if (!existsSync(productDir)) {
    await mkdir(productDir, { recursive: true })
  }

  // Generate unique filename
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
  const filepath = path.join(productDir, filename)

  // Convert File to Buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Optimize image using sharp
  const optimizedBuffer = await sharp(buffer)
    .resize(800, 800, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality: 90, progressive: true })
    .toBuffer()

  // Save file
  await writeFile(filepath, optimizedBuffer)

  const publicUrl = `/uploads/products/${productSlug}/${filename}`

  return {
    url: publicUrl,
    filename,
    size: optimizedBuffer.length,
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit.',
    }
  }

  return { valid: true }
}
