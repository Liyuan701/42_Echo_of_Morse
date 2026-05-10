import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/db'

//! With NextAuth
import { getServerSession } from 'next-auth'
// import { authOptions } from '../../../../lib/auth'

//?
import { prisma } from '@/server/prisma'
import { authOptions } from '@/lib/auth'
// PUT /api/friends/[id] - Accept or reject a friend request
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> } // ✅ Fix
) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		//? -----
		// const userId = session.user?.id;
		const userId = (session.user as { id?: string } | undefined)?.id;
		if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		//? -----

		const { id } = await params
		const body = await request.json()
		const { status } = body

		if (!status || !['ACCEPTED', 'BLOCKED'].includes(status)) {
			return NextResponse.json(
				{ error: 'Status must be ACCEPTED or BLOCKED' },
				{ status: 400 }
			)
		}

		const friendship = await prisma.friendship.findUnique({
			where: { id: parseInt(id) }
		})
		//? -----
		// if (friendship?.receiverId !== session.user.id) {
		if (friendship?.receiverId !== userId) {
		//?
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

	//? -----
		const updatedFriendship = await prisma.friendship.update({
			where: { id: parseInt(id) },
			data: { status: status }
		})
	//? -----

		return NextResponse.json(updatedFriendship)

	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// DELETE /api/friends/[id] - Remove a friend or cancel a request
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> } // ✅ Fix
) {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}
		
		//? -----
		const userId = (session.user as { id?: string } | undefined)?.id;

		if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		//? -----

		const { id } = await params
		const friendship = await prisma.friendship.findUnique({
			where: { id: parseInt(id) }
		})

		//?-----
		if (friendship?.senderId !== userId && friendship?.receiverId !== userId) {
		// if (friendship?.senderId !== session.user.id && friendship?.receiverId !== session.user.id) {
		//? ----
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		await prisma.friendship.delete({
			where: { id: parseInt(id) }
		})

		return NextResponse.json(
			{ message: 'Friendship deleted successfully' },
			{ status: 200 }
		)

	} catch (error) {
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
