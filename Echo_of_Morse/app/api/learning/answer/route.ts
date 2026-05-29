import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/server/prisma";
import { morseLevels } from "@/components/learning/data/morseLevels";

// 从 passCondition 字符串 "≥ 60% (12/20)" 里提取 12 和 20
function parsePassCondition(passCondition: string): { required: number; total: number } {
  const match = passCondition.match(/\((\d+)\/(\d+)\)/);
  if (!match) return { required: 0, total: 1 };
  return { required: parseInt(match[1]), total: parseInt(match[2]) };
}

// 简单 SRS：答对 interval * easeFactor，答错重置到 1 天
function calcNextReview(correct: boolean, interval: number, easeFactor: number) {
  if (correct) {
    const newInterval = Math.round(interval * easeFactor);
    const newEaseFactor = Math.min(easeFactor + 0.1, 3.0);
    return { interval: newInterval, easeFactor: newEaseFactor };
  } else {
    const newEaseFactor = Math.max(easeFactor - 0.2, 1.3);
    return { interval: 1, easeFactor: newEaseFactor };
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { levelId, char, correct, isLastQuestion, sessionCorrect, sessionTotal } =
    await req.json();

  const userId = session.user.id;

  // 1. 找到这个字母在 Letter 表里的 id
  const letter = await prisma.letter.findUnique({ where: { char } });
  if (!letter) {
    return Response.json({ error: "Letter not found" }, { status: 404 });
  }

  // 2. 找到现有进度（没有就初始化）
  const existing = await prisma.userLetterProgress.findUnique({
    where: { userId_letterId: { userId, letterId: letter.id } },
  });

  const now = new Date();
  const currentInterval = existing?.interval ?? 1;
  const currentEaseFactor = existing?.easeFactor ?? 2.5;
  const { interval, easeFactor } = calcNextReview(correct, currentInterval, currentEaseFactor);
  const nextReviewAt = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  // mastery: 答对 +1 (max 10)，答错 -1 (min 0)
  const currentMastery = existing?.mastery ?? 0;
  const newMastery = correct
    ? Math.min(currentMastery + 1, 10)
    : Math.max(currentMastery - 1, 0);

  // 3. Upsert UserLetterProgress
  await prisma.userLetterProgress.upsert({
    where: { userId_letterId: { userId, letterId: letter.id } },
    update: {
      correctCount: { increment: correct ? 1 : 0 },
      wrongCount:   { increment: correct ? 0 : 1 },
      totalSeen:    { increment: 1 },
      mastery:      newMastery,
      interval,
      easeFactor,
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
      interval,
      easeFactor,
      nextReviewAt,
      lastReviewed: now,
    },
  });

  // 4. 最后一题：判断是否升级
  if (isLastQuestion) {
    const levelConfig = morseLevels.find((l) => l.level === levelId);
    if (levelConfig) {
      const { required } = parsePassCondition(levelConfig.passCondition);
      const passed = sessionCorrect >= required;

      if (passed) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { learningLevel: true },
        });

        // 只有当前 level 通过才升级，不能跳级
        if (user && user.learningLevel === levelId) {
          await prisma.user.update({
            where: { id: userId },
            data: { learningLevel: { increment: 1 } },
          });

          return Response.json({ leveledUp: true, newLevel: levelId + 1 });
        }
      }

      return Response.json({ leveledUp: false, passed });
    }
  }

  return Response.json({ leveledUp: false });
}