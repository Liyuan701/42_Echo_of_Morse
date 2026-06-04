import { prisma } from "@/server/prisma";
import type { UserLearningProgress } from "@/types/learning";

const WEAK_MASTERY_THRESHOLD = 4;
const TOTAL_LEVELS = 12;

export async function getUserLearningProgress(
  userId: string
): Promise<UserLearningProgress> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      learningLevel: true,
      practiceSessions: true,
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
  const completedLevels = Array.from(
    { length: currentLevel - 1 },
    (_, index) => index + 1
  );
  const unlockedLevels = Array.from(
    { length: currentLevel },
    (_, index) => index + 1
  );

  const totalSeen = user.letterProgresses.reduce(
    (sum, progress) => sum + progress.totalSeen,
    0
  );

  const totalCorrect = user.letterProgresses.reduce(
    (sum, progress) => sum + progress.correctCount,
    0
  );

  const globalAccuracy =
    totalSeen === 0 ? null : Math.round((totalCorrect / totalSeen) * 100);

  const weakCharacters = user.letterProgresses
    .filter(
      (progress) =>
        progress.totalSeen > 0 && progress.mastery < WEAK_MASTERY_THRESHOLD
    )
    .sort((a, b) => a.mastery - b.mastery)
    .map((progress) => progress.letter.char);

  return {
    currentLevel,
    unlockedLevels,
    completedLevels,
    globalAccuracy,
    totalPracticeSessions: user.practiceSessions,
    weakCharacters,
  };
}