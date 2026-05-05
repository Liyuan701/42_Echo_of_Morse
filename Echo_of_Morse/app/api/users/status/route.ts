// Get request from the server and update the DB
// update the isOnline, lastSeen in DB


import { NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';

export async function POST(request: Request) {
  const { userId, isOnline } = await request.json();
  
  await prisma.user.update({
    where: { id: userId },
    data: { 
      isOnline,
      lastSeen: new Date()
    }
  });
  
  return NextResponse.json({ ok: true });
}