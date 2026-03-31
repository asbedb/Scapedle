import { WORD_LIST } from '$lib/server/wordList';

const getSeededRandom = (seed: number): number => {
	let t = seed + 0x6d2b79f5;
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const load = () => {
	const now: Date = new Date();
	const start: Date = new Date(now.getFullYear(), 0, 0);
	const dayOfYear: number = Math.floor((now.getTime() - start.getTime()) / 86400000);
	const seed: number = dayOfYear + now.getFullYear();
	const randomIndex: number = Math.floor(getSeededRandom(seed) * WORD_LIST.length);

	const dailyWord = WORD_LIST[randomIndex];

	return {
		...dailyWord,
		itemName: btoa(dailyWord.itemName),
		wordNumber: dayOfYear
	};
};
