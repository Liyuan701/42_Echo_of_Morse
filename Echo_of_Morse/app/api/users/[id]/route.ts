// API Route: /api/users/[id]
// This file handles all HTTP requests for a specific user by their id.
// It allows the frontend to retrieve and update user information.
// The [id] in the path is a dynamic parameter, meaning any number can be passed.
// Example: GET /api/users/123 will return the information of user with id 123.

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/server/prisma'

//! With NextAuth
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/users/[id] - get user information
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        isOnline: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Update user information (avatar, email)
// verify it's a exit account, and the id is the same with the one to be changed. 
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const userId = parseInt(id)
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get the data from the request body
    const body = await request.json()
    const { email, avatarUrl } = body

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(email && { email }),
        ...(avatarUrl && { avatarUrl }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        isOnline: true,
      }
    })

    return NextResponse.json(updatedUser)

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// update online account
export async function GET() {
  const count = await prisma.user.count({
    where: { isOnline: true }
  });
  return NextResponse.json({ count });
}