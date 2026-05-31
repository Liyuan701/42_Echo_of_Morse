import type { MorseLevel } from "@/types/learning";

// TODO_BACKEND:
//! Liyuan : Static mock level configuration for the Learning module.
// This can remain frontend-side for the first version.
// If levels are stored in the database later, replace this with:
// GET /api/learning/levels
//
// Expected backend shape per level:
// {
//   level: number;
//   title: string;
//   newCharacters: string[];
//   reviewFrom: string;
//   newRatio: string;
//   reviewRatio: string;
//   questionCount: number;
//   passCondition: string;
// }

export const morseLevels: MorseLevel[] = [
  {
    level: 1,
    title: "Level 1",
    newCharacters: ["E .", "T —", "I ..", "A .—"],
    reviewFrom: "No review",
    newRatio: "100% new",
    reviewRatio: "0% review",
    questionCount: 20,
    passCondition: "≥ 60% (12/20)",
  },
  {
    level: 2,
    title: "Level 2",
    newCharacters: ["N —.", "M ——", "S ...", "O ———"],
    reviewFrom: "Level 1",
    newRatio: "70% new",
    reviewRatio: "30% review",
    questionCount: 20,
    passCondition: "≥ 60% (12/20)",
  },
  {
    level: 3,
    title: "Level 3",
    newCharacters: ["R .—.", "H ....", "D —..", "L .—.."],
    reviewFrom: "Levels 1-2",
    newRatio: "60% new",
    reviewRatio: "40% review",
    questionCount: 20,
    passCondition: "≥ 65% (13/20)",
  },
  {
    level: 4,
    title: "Level 4",
    newCharacters: ["U ..—", "C —.—.", "F ..—.", "G ——."],
    reviewFrom: "Levels 1-3",
    newRatio: "60% new",
    reviewRatio: "40% review",
    questionCount: 20,
    passCondition: "≥ 65% (13/20)",
  },
  {
    level: 5,
    title: "Level 5",
    newCharacters: ["P .——.", "B —...", "W .——", "Y —.——"],
    reviewFrom: "Levels 1-4",
    newRatio: "55% new",
    reviewRatio: "45% review",
    questionCount: 20,
    passCondition: "≥ 65% (13/20)",
  },
  {
    level: 6,
    title: "Level 6",
    newCharacters: ["K —.—", "V ...—", "X —..—", "J .———"],
    reviewFrom: "Levels 1-5",
    newRatio: "55% new",
    reviewRatio: "45% review",
    questionCount: 20,
    passCondition: "≥ 70% (14/20)",
  },
  {
    level: 7,
    title: "Level 7",
    newCharacters: ["Q ——.—", "Z ——.."],
    reviewFrom: "Levels 1-6",
    newRatio: "40% new",
    reviewRatio: "60% review",
    questionCount: 20,
    passCondition: "≥ 70% (14/20)",
  },
  {
    level: 8,
    title: "Level 8",
    newCharacters: ["0 —————", "1 .————", "2 ..———", "3 ...——", "4 ....—"],
    reviewFrom: "Levels 1-7",
    newRatio: "50% new",
    reviewRatio: "50% review",
    questionCount: 24,
    passCondition: "≥ 70% (17/24)",
  },
  {
    level: 9,
    title: "Level 9",
    newCharacters: ["5 .....", "6 —....", "7 ——...", "8 ———..", "9 ————."],
    reviewFrom: "Levels 1-8",
    newRatio: "45% new",
    reviewRatio: "55% review",
    questionCount: 25,
    passCondition: "≥ 75% (19/25)",
  },
  {
    level: 10,
    title: "Level 10",
    newCharacters: [
      ". .-.-.-",
      ", --..--",
      "? ..--..",
      "! -.-.--",
      "/ -..-.",
      "- -....-",
    ],
    reviewFrom: "Levels 1-9",
    newRatio: "50% new",
    reviewRatio: "50% review",
    questionCount: 30,
    passCondition: "≥ 75% (23/30)",
  },
  {
    level: 11,
    title: "Level 11",
    newCharacters: [
      "( -.--.",
      ") -.--.-",
      "& .-...",
      ": ---...",
      "; -.-.-.",
      "= -...-",
    ],
    reviewFrom: "Levels 1-10",
    newRatio: "50% new",
    reviewRatio: "50% review",
    questionCount: 30,
    passCondition: "≥ 80% (24/30)",
  },
  {
    level: 12,
    title: "Level 12",
    newCharacters: [
      "+ .-.-.",
      "_ ..--.-",
      '" .-..-.',
      "$ ...-..-",
      "@ .--.-.",
    ],
    reviewFrom: "Levels 1-11",
    newRatio: "50% new",
    reviewRatio: "50% review",
    questionCount: 30,
    passCondition: "≥ 80% (24/30)",
  },
];

//代表某个用户的学习进度。现在用 mock，之后可以从后端 API 拿。