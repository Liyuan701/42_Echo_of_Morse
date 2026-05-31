import type { UserLearningProgress } from "@/types/learning";

//! Liyuan
// TODO_BACKEND:
// Temporary mock data for the Learning module.
// Replace this file with GET /api/learning/progress.
//
// Expected backend shape:
// {
//   currentLevel: number;
//   unlockedLevels: number[];
//   completedLevels: number[];
//   globalAccuracy: number | null;
//   totalPracticeSessions: number | null;
//   weakCharacters: string[];
// }

export const mockLearningProgress: UserLearningProgress = {
  currentLevel: 1,
  unlockedLevels: [1],
  completedLevels: [],
  globalAccuracy: null,
  totalPracticeSessions: null,
  weakCharacters: [],
};