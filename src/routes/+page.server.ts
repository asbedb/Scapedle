import { WORD_LIST } from '$lib/server/wordList';

export const load = () => {
	const dayOfYear = Math.floor(
		(Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
	);
	const dailyWord = WORD_LIST[dayOfYear % WORD_LIST.length];
	return {
		xgha: dailyWord
	};
};
