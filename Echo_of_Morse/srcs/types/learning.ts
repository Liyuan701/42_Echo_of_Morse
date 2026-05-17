export type MorseLevel = {
  level: number;
  title: string;
  newCharacters: string[];
  reviewFrom: string;
  newRatio: string;
  reviewRatio: string;
  questionCount: number;
  passCondition: string;
};

export type UserLearningProgress = {
  currentLevel: number;
  unlockedLevels: number[];
  completedLevels: number[];
  globalAccuracy: number;
  averageReactionTime: number;
  totalSessions: number;
  todayLearningMinutes: number;
  weakCharacters: string[];
};