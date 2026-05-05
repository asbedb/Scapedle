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

	const aestToday = new Date(year, month, day);
	const startOfYear = new Date(year, 0, 0);
	const dayOfYear = Math.floor((aestToday.getTime() - startOfYear.getTime()) / 86400000);

	const seed: number = year * 1000 + dayOfYear;
	const randomIndex: number = Math.floor(getSeededRandom(seed) * WORD_LIST.length);
	const dailyWord = WORD_LIST[randomIndex];
	// Generates a hashmap of individual words extracted from our wordList to optimize searches.
	// Key = word length, Value = array of unique uppercase words.
	return {
		...dailyWord,
		itemName: btoa(dailyWord.itemName),
		wordNumber: dayOfYear,
		dictionary,
		wordCount
	};
};
