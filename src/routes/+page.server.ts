import { WORD_LIST } from '$lib/server/wordList';

const processDictionary = () => {
	const dict: Record<number, string[]> = {};
	const uniqueWords = new Set<string>();
	WORD_LIST.forEach((item) => {
		const words = item.itemName.toUpperCase().replace(/'/g, '').split(/\s+/);
		words.forEach((word) => {
			if (word.length > 0) uniqueWords.add(word);
		});
	});
	uniqueWords.forEach((word) => {
		const len = word.length;
		if (!dict[len]) dict[len] = [];
		dict[len].push(word);
	});
	return { dictionary: dict, wordCount: uniqueWords.size };
};

const getSeededRandom = (seed: number): number => {
	let t = seed + 0x6d2b79f5;
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const getSeed = (year: number, month: number, day: number) => {
	const date = new Date(Date.UTC(year, month, day));
	const y = date.getUTCFullYear();
	const dayOfYear = (date.getTime() - Date.UTC(y, 0, 0)) / 86400000;
	return { seed: y * 1000 + dayOfYear, dayOfYear };
};

const { dictionary, wordCount } = processDictionary();

export const load = () => {
	const now: Date = new Date();
	const formatter = new Intl.DateTimeFormat('en-AU', {
		timeZone: 'Australia/Sydney',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	});
	const parts = formatter.formatToParts(now);
	const dateMap = Object.fromEntries(parts.map((p) => [p.type, p.value]));

	const year = parseInt(dateMap.year);
	const month = parseInt(dateMap.month) - 1;
	const day = parseInt(dateMap.day);

	const today = getSeed(year, month, day);
	const yesterday = getSeed(year, month, day - 1);

	const dailyWord = WORD_LIST[Math.floor(getSeededRandom(today.seed) * WORD_LIST.length)];
	const yesterdaysWord = WORD_LIST[Math.floor(getSeededRandom(yesterday.seed) * WORD_LIST.length)];
	// Generates a hashmap of individual words extracted from our wordList to optimize searches.
	// Key = word length, Value = array of unique uppercase words.
	return {
		...dailyWord,
		itemName: btoa(dailyWord.itemName),
		wordNumber: today.dayOfYear,
		dictionary,
		wordCount,
		yesterdaysWord: yesterdaysWord.itemName
	};
};
