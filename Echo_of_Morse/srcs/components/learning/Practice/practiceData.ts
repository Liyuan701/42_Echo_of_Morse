import type { CharacterItem } from "./practiceTypes";
//* Les regles de l'exercice

// 1er [] => tous les levels, 2e [] => les caracteres de chaque level
export const MORSE_LEVELS: CharacterItem[][] = [
	[
		{ character: "E", morse: ".", level: 1 },
		{ character: "T", morse: "-", level: 1 },
		{ character: "I", morse: "..", level: 1 },
		{ character: "A", morse: ".-", level: 1 },
	],
	[
		{ character: "N", morse: "-.", level: 2 },
		{ character: "M", morse: "--", level: 2 },
		{ character: "S", morse: "...", level: 2 },
		{ character: "O", morse: "---", level: 2 },
	],
	[
		{ character: "R", morse: ".-.", level: 3 },
		{ character: "H", morse: "....", level: 3 },
		{ character: "D", morse: "-..", level: 3 },
		{ character: "L", morse: ".-..", level: 3 },
	],
	[
		{ character: "U", morse: "..-", level: 4 },
		{ character: "C", morse: "-.-.", level: 4 },
		{ character: "F", morse: "..-.", level: 4 },
		{ character: "G", morse: "--.", level: 4 },
	],
	[
		{ character: "P", morse: ".--.", level: 5 },
		{ character: "B", morse: "-...", level: 5 },
		{ character: "W", morse: ".--", level: 5 },
		{ character: "Y", morse: "-.--", level: 5 },
	],
	[
		{ character: "K", morse: "-.-", level: 6 },
		{ character: "V", morse: "...-", level: 6 },
		{ character: "X", morse: "-..-", level: 6 },
		{ character: "J", morse: ".---", level: 6 },
	],
	[
		{ character: "Q", morse: "--.-", level: 7 },
		{ character: "Z", morse: "--..", level: 7 },
	],
	[
		{ character: "0", morse: "-----", level: 8 },
		{ character: "1", morse: ".----", level: 8 },
		{ character: "2", morse: "..---", level: 8 },
		{ character: "3", morse: "...--", level: 8 },
		{ character: "4", morse: "....-", level: 8 },
	],
	[
		{ character: "5", morse: ".....", level: 9 },
		{ character: "6", morse: "-....", level: 9 },
		{ character: "7", morse: "--...", level: 9 },
		{ character: "8", morse: "---..", level: 9 },
		{ character: "9", morse: "----.", level: 9 },
	],
	[
		{ character: ".", morse: ".-.-.-", level: 10 },
		{ character: ",", morse: "--..--", level: 10 },
		{ character: "?", morse: "..--..", level: 10 },
		{ character: "!", morse: "-.-.--", level: 10 },
		{ character: "/", morse: "-..-.", level: 10 },
		{ character: "-", morse: "-....-", level: 10 },
	],
	[
		{ character: "(", morse: "-.--.", level: 11 },
		{ character: ")", morse: "-.--.-", level: 11 },
		{ character: "&", morse: ".-...", level: 11 },
		{ character: ":", morse: "---...", level: 11 },
		{ character: ";", morse: "-.-.-.", level: 11 },
		{ character: "=", morse: "-...-", level: 11 },
	],
	[
		{ character: "+", morse: ".-.-.", level: 12 },
		{ character: "_", morse: "..--.-", level: 12 },
		{ character: "\"", morse: ".-..-.", level: 12 },
		{ character: "$", morse: "...-..-", level: 12 },
		{ character: "@", morse: ".--.-.", level: 12 },
	],
];

// const => la variable ne peut pas changer.
// as const => TypeScript comprend que les valeurs dedans sont fixes
	// ex: const a = {level: 1,}; 
	//	- sans as const -> a.level: number; donc on peut a.level = 2;
	//	- avec as const -> a.level = 1;
export const LEVEL_RULES = {
	1: { questionCount: 20, passCount: 12, newRatio: 1 },
	2: { questionCount: 20, passCount: 12, newRatio: 0.7 },
	3: { questionCount: 20, passCount: 13, newRatio: 0.6 },
	4: { questionCount: 20, passCount: 13, newRatio: 0.6 },
	5: { questionCount: 20, passCount: 13, newRatio: 0.55 },
	6: { questionCount: 20, passCount: 14, newRatio: 0.55 },
	7: { questionCount: 20, passCount: 14, newRatio: 0.4 },
	8: { questionCount: 24, passCount: 17, newRatio: 0.5 },
	9: { questionCount: 25, passCount: 19, newRatio: 0.45 },
	10: { questionCount: 30, passCount: 23, newRatio: 0.5 }, //? pas sur en ratio
	11: { questionCount: 30, passCount: 24, newRatio: 0.5 }, //?
	12: { questionCount: 30, passCount: 24, newRatio: 0.5 }, //?
} as const;

// keyof = prend toutes les key d’un type
//ici levelId = 1-12
export type LevelId = keyof typeof LEVEL_RULES;
