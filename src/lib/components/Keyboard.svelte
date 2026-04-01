<script lang="ts">
	import { gameState } from '$lib/stores/gameState.svelte';
	import { BLANK_GUESS } from '$lib/constants';
	const charStatuses = $derived.by(() => {
		const statuses: Record<string, string> = {};
		const targetAlphaCounts = getCounts(targetAlpha);
		gameState.guesses.forEach((guess) => {
			if (guess === BLANK_GUESS) return;
			const usedCounts: Record<string, number> = {};
			for (let i = 0; i < guess.length; i++) {
				const char = guess[i];
				if (char === targetAlpha[i]) {
					statuses[char] = 'bg-green-600 border-green-600';
					usedCounts[char] = (usedCounts[char] || 0) + 1;
				}
			}
			for (let i = 0; i < guess.length; i++) {
				const char = guess[i];
				if (char === targetAlpha[i]) continue;

				if (targetAlpha.includes(char)) {
					const totalInTarget = targetAlphaCounts[char] || 0;
					const usedSoFar = usedCounts[char] || 0;

					if (usedSoFar < totalInTarget) {
						if (statuses[char] !== 'bg-green-600 border-green-600') {
							statuses[char] = 'bg-yellow-600 border-yellow-600';
						}
						usedCounts[char] = usedSoFar + 1;
					} else {
						if (!statuses[char]) {
							statuses[char] = 'bg-zinc-800 border-zinc-800 opacity-40';
						}
					}
				} else {
					if (!statuses[char]) {
						statuses[char] = 'bg-zinc-800 border-zinc-800 opacity-40';
					}
				}
			}
		});

		return statuses;
	});
	let { onKey, targetAlpha } = $props<{
		onKey: (key: string) => void;
		targetAlpha: string;
	}>();

	const rows = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
	];

	const getCounts = (str: string) => {
		const counts: Record<string, number> = {};
		for (const char of str) {
			counts[char] = (counts[char] || 0) + 1;
		}
		return counts;
	};
</script>

<div
	class="mt-4 flex w-full max-w-125 flex-col items-center gap-1.5 px-1"
	style="touch-action: manipulation;"
>
	{#each rows as row, i (i)}
		<div class="flex w-full justify-center gap-1 sm:gap-1.5">
			{#each row as key (key)}
				{@const colorClass = charStatuses[key] || 'bg-zinc-600'}
				<button
					onclick={(e) => {
						e.stopPropagation();
						onKey(key);
					}}
					type="button"
					class="flex h-14 items-center justify-center rounded font-bold uppercase transition-all select-none
                           {key === 'ENTER' || key === 'BACK'
						? 'flex-[1.5] text-[10px] sm:text-xs'
						: 'flex-1 text-lg'} 
                           {colorClass} hover:brightness-110 active:scale-95"
				>
					{key === 'BACK' ? '⌫' : key}
				</button>
			{/each}
		</div>
	{/each}
</div>
