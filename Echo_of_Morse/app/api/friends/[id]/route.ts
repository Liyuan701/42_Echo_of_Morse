import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/server/prisma'
import { authOptions } from '@/lib/auth'

function parseFriendshipId(id: string) {
	const friendshipId = Number(id)

	return Number.isInteger(friendshipId) ? friendshipId : null
}

// PUT /api/friends/[id] - Accept or reject a friend request
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
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
		const friendshipId = parseFriendshipId(id)
		if (friendshipId === null) {
			return NextResponse.json({ error: 'Invalid friendship id' }, { status: 400 })
		}

		const body = await request.json()
		const { status } = body

		if (!status || !['ACCEPTED', 'BLOCKED'].includes(status)) {
			return NextResponse.json(
				{ error: 'Status must be ACCEPTED or BLOCKED' },
				{ status: 400 }
			)
		}

		const friendship = await prisma.friendship.findUnique({
			where: { id: friendshipId }
		})

		if (!friendship) {
			return NextResponse.json({ error: 'Friendship not found' }, { status: 404 })
		}

		//? -----
		// if (friendship?.receiverId !== session.user.id) {
		if (friendship.receiverId !== userId) {
		//?
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

	//? -----
		const updatedFriendship = await prisma.friendship.update({
			where: { id: friendshipId },
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
		const friendshipId = parseFriendshipId(id)
		if (friendshipId === null) {
			return NextResponse.json({ error: 'Invalid friendship id' }, { status: 400 })
		}

		const friendship = await prisma.friendship.findUnique({
			where: { id: friendshipId }
		})

		if (!friendship) {
			return NextResponse.json({ error: 'Friendship not found' }, { status: 404 })
		}

		//?-----
		if (friendship.senderId !== userId && friendship.receiverId !== userId) {
		// if (friendship?.senderId !== session.user.id && friendship?.receiverId !== session.user.id) {
		//? ----
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		await prisma.friendship.delete({
			where: { id: friendshipId }
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
