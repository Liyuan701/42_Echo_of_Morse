import type { UserLearningProgress } from "@/types/learning";

// TODO_BACKEND:
//! Liyuan: Temporary mock data for the Learning module.
// Replace this file with real user progress from:
// GET /api/learning/progress
//
// Expected backend shape:
// {
//   currentLevel: number;
//   unlockedLevels: number[];
//   completedLevels: number[];
//   globalAccuracy: number;
//   averageReactionTime: number;
//   totalSessions: number;
//   todayLearningMinutes: number;
//   weakCharacters: string[];
// }

export const mockLearningProgress: UserLearningProgress = {
  currentLevel: 3,
  unlockedLevels: [1, 2, 3],
  completedLevels: [1, 2],
  globalAccuracy: 72,
  averageReactionTime: 1.8,
  totalSessions: 12,
  todayLearningMinutes: 18,
  weakCharacters: ["R", "H", "Q"],
};

//这个文件之后可以删掉，换成后端 API 返回的数据。