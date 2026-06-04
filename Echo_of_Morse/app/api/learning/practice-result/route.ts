import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/server/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { levelId, passed, answers } = await req.json();
  //console.log("answers received:", JSON.stringify(answers)); // debug log
  //console.log("levelId:", levelId, "passed:", passed); //debug log
  const userId = session.user.id;

  // 1. Update UserLetterProgress for each answered question
  
  for (const { char, correct } of answers) {
    //console.log("looking for char:", JSON.stringify(char));//debug log 
    const letter = await prisma.letter.findUnique({ where: { char } });
    //console.log("letter found:", letter);//debug log

    if (!letter) continue;

    const existing = await prisma.userLetterProgress.findUnique({
      where: { userId_letterId: { userId, letterId: letter.id } },
    });

    const now = new Date();
    const currentMastery = existing?.mastery ?? 0;
    const currentInterval = existing?.interval ?? 1;
    const currentEaseFactor = existing?.easeFactor ?? 2.5;

    const newMastery = correct
      ? Math.min(currentMastery + 1, 10)
      : Math.max(currentMastery - 1, 0);

    const newInterval = correct ? Math.round(currentInterval * currentEaseFactor) : 1;
    const newEaseFactor = correct
      ? Math.min(currentEaseFactor + 0.1, 3.0)
      : Math.max(currentEaseFactor - 0.2, 1.3);

    const nextReviewAt = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

    await prisma.userLetterProgress.upsert({
      where: { userId_letterId: { userId, letterId: letter.id } },
      update: {
        correctCount: { increment: correct ? 1 : 0 },
        wrongCount:   { increment: correct ? 0 : 1 },
        totalSeen:    { increment: 1 },
        mastery:      newMastery,
        interval:     newInterval,
        easeFactor:   newEaseFactor,
        nextReviewAt,
        lastReviewed: now,
      },
      create: {
        userId,
        letterId: letter.id,
        correctCount: correct ? 1 : 0,
        wrongCount:   correct ? 0 : 1,
        totalSeen:    1,
        mastery:      correct ? 1 : 0,
        interval:     newInterval,
        easeFactor:   newEaseFactor,
        nextReviewAt,
        lastReviewed: now,
      },
    });
    console.log("upserted:", char, correct);
  }

  // 2. Level up if passed current level
  if (passed) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { learningLevel: true },
    });

    if (user && user.learningLevel === levelId) {
      await prisma.user.update({
        where: { id: userId },
        data: { learningLevel: { increment: 1 } },
      });
    }
  }

  // 3. Increment practice sessions count
  await prisma.user.update({
    where: { id: userId },
    data: { practiceSessions: { increment: 1 } },
  });

  return Response.json({ ok: true });
}