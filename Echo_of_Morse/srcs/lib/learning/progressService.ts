import { prisma } from "@/server/prisma";
import type { UserLearningProgress } from "@/types/learning";

const WEAK_MASTERY_THRESHOLD = 4;
const TOTAL_LEVELS = 10;

export async function getUserLearningProgress(
  userId: string
): Promise<UserLearningProgress> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      learningLevel: true,
      letterProgresses: {
        select: {
          mastery: true,
          correctCount: true,
          totalSeen: true,
          letter: { select: { char: true } },
        },
      },
    },
  });

  const currentLevel = Math.min(user.learningLevel, TOTAL_LEVELS);
  const completedLevels = Array.from({ length: currentLevel - 1 }, (_, i) => i + 1);
  const unlockedLevels = Array.from({ length: currentLevel }, (_, i) => i + 1);

  const seenProgresses = user.letterProgresses.filter((p) => p.totalSeen > 0);
  const globalAccuracy =
    seenProgresses.length === 0
      ? 0
      : Math.round(
          (seenProgresses.reduce(
            (sum, p) => sum + p.correctCount / p.totalSeen,
            0
          ) / seenProgresses.length) * 100
        );

  const weakCharacters = user.letterProgresses
    .filter((p) => p.totalSeen > 0 && p.mastery < WEAK_MASTERY_THRESHOLD)
    .sort((a, b) => a.mastery - b.mastery)
    .map((p) => p.letter.char);

  return {
    currentLevel,
    unlockedLevels,
    completedLevels,
    globalAccuracy,
    averageReactionTime: 0, //to update schema
    totalSessions: 0,//to update schema
    todayLearningMinutes: 0,//to update schema
    weakCharacters,
  };
}