// Database connection file
// This file creates and exports a single Prisma Client instance
// that is reused across the entire application to avoid
// creating too many database connections

import { PrismaClient } from '@/generated/prisma'

// Extend the global object to store the Prisma instance
// This prevents multiple instances during Next.js hot reload in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use existing instance if available, otherwise create a new one
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

// In development, save the instance to the global object
// In production, a new instance is created once and reused
// the process.env.NODE_ENV is settled by the start command (run dev/start)
// in package.json, dev->next dev, NODE_ENV = development
// in package.json, start->next start, NODE_ENV = production
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
