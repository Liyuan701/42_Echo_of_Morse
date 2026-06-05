import { prisma } from "@/server/prisma";
import type { UserLearningProgress } from "@/types/learning";

// if lower than these thresholds, the character is considered weak and should be prioritized for practice.
const WEAK_MASTERY_THRESHOLD = 4;

// Total number of learning levels in the system. This can be adjusted as the curriculum expands.
const TOTAL_LEVELS = 12;

// Morse code mapping for characters. This can be expanded to include more characters as needed.
const MORSE_MAP: Record<string, string> = {
  A: ".-",    B: "-...",  C: "-.-.",  D: "-..",   E: ".",
  F: "..-.",  G: "--.",   H: "....",  I: "..",    J: ".---",
  K: "-.-",   L: ".-..",  M: "--",    N: "-.",    O: "---",
  P: ".--.",  Q: "--.-",  R: ".-.",   S: "...",   T: "-",
  U: "..-",   V: "...-",  W: ".--",   X: "-..-",  Y: "-.--",
  Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--",
  "/": "-..-.",  "(": "-.--.",  ")": "-.--.-", "&": ".-...",
  ":": "---...", ";": "-.-.-.", "=": "-...-",  "+": ".-.-.",
  "-": "-....-", "_": "..--.-", '"': ".-..-.", "$": "...-..-$", "@": ".--.-.",
};

export async function getUserLearningProgress(
  userId: string
): Promise<UserLearningProgress> {
  // Fetch the user's learning progress data from the database
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      learningLevel: true,
      practiceSessions: true,
      letterProgresses: {
        select: {
          mastery: true,
          correctCount: true,
          wrongCount: true,
          totalSeen: true,
          letter: { select: { char: true } },
        },
      },
    },
  });

  // Calculate the current level, completed levels, and unlocked levels based on the user's learning level
  const currentLevel = Math.min(user.learningLevel, TOTAL_LEVELS);

  const completedLevels = Array.from(
    { length: currentLevel - 1 },
    (_, index) => index + 1
  );

  const unlockedLevels = Array.from(
    { length: currentLevel },
    (_, index) => index + 1
  );

  // Global stats
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

  // Map letter progress first (used by weak character detection)
  const letterProgress = user.letterProgresses.map((p) => ({
    character: p.letter.char,
    morse: MORSE_MAP[p.letter.char] ?? "",
    correctCount: p.correctCount,
    wrongCount: p.wrongCount,
    totalSeen: p.totalSeen,
    mastery: p.mastery,
  }));

  // Weak characters derived ONLY from letterProgress
  const weakCharacters = letterProgress
    .filter(
      (p) =>
        p.totalSeen > 0 && p.mastery < WEAK_MASTERY_THRESHOLD
    )
    .sort((a, b) => a.mastery - b.mastery)
    .map((p) => p.character);

  return {
    currentLevel,
    unlockedLevels,
    completedLevels,
    globalAccuracy,
    totalPracticeSessions: user.practiceSessions,
    weakCharacters,
    letterProgress,
  };
}