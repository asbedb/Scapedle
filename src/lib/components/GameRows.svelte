<script lang="ts">
	import { MAX_GUESSES, isSpecial, BLANK_GUESS } from '$lib/constants';
	import { gameState } from '$lib/stores/gameState.svelte';
	let { solution, targetAlpha } = $props<{
		solution: string;
		targetAlpha: string;
	}>();
	const rows = $derived(Array.from({ length: MAX_GUESSES }, (_, i) => i));
	const cols = $derived(Array.from({ length: solution.length }, (_, i) => i));

	// gets a letter at a row/col
	function getLetterAt(rowIndex: number, colIndex: number) {
		const charInWord = solution[colIndex];
		if (isSpecial(charInWord)) return charInWord;
		const alphaIndex = solution.slice(0, colIndex).replace(/[^a-zA-Z]/g, '').length;
		const guessAtRow = gameState.guesses[rowIndex];
		if (guessAtRow === BLANK_GUESS) return '';
		if (rowIndex < gameState.guesses.length) return guessAtRow[alphaIndex];
		if (rowIndex === gameState.guesses.length) return gameState.currentGuess[alphaIndex];
		return '';
	}
	function getBoxStatus(guess: string, colIndex: number) {
		if (guess === BLANK_GUESS) return 'bg-zinc-800 border-zinc-900 opacity-40';
		const charInWord = solution[colIndex];
		if (isSpecial(charInWord)) return 'border-none text-zinc-500';
		const alphaIndex = solution.slice(0, colIndex).replace(/[^a-zA-Z]/g, '').length;
		const char = guess[alphaIndex];
		const targetChar = targetAlpha[alphaIndex];
		if (char === targetChar) return 'bg-green-600 border-green-600 text-white';
		if (!targetAlpha.includes(char)) return 'bg-zinc-700 border-zinc-700 text-zinc-400';
		const totalOccurrences = targetAlpha.split('').filter((c: string) => c === char).length;
		const greensInGuess = guess
			.split('')
			.filter((c, i) => c === char && targetAlpha[i] === char).length;
		const precedingYellows = guess
			.slice(0, alphaIndex)
			.split('')
			.filter((c, i) => c === char && targetAlpha[i] !== char).length;
		if (greensInGuess + precedingYellows < totalOccurrences) {
			return 'bg-yellow-600 border-yellow-600 text-white';
		}
		return 'bg-zinc-700 border-zinc-700 text-zinc-400';
	}
</script>

{#each rows as r (r)}
	<div
		class="flex justify-center gap-1 sm:gap-2 {r === gameState.guesses.length &&
		gameState.invalidWord
			? 'animate-pulse'
			: ''}"
	>
		{#each cols as c (c)}
			{@const letter = getLetterAt(r, c)}
			{@const isCharSpecial = isSpecial(solution[c])}
			{@const isSubmitted = r < gameState.guesses.length}
			{@const isCurrent = r === gameState.guesses.length}

			<div
				class="flex aspect-square w-full max-w-12 items-center justify-center border-2 text-lg font-bold uppercase transition-all duration-500 sm:h-12 sm:w-12 sm:text-2xl
                    {isSubmitted && !isCharSpecial ? getBoxStatus(gameState.guesses[r], c) : ''}
                    {isCurrent && !isCharSpecial ? 'border-zinc-400 bg-zinc-800/50' : ''}
                    {!isSubmitted && !isCurrent && !isCharSpecial ? 'border-zinc-600' : ''}
                    {isCharSpecial ? 'border-none text-zinc-500' : ''}"
			>
				{letter || ''}
			</div>
		{/each}
	</div>
{/each}
