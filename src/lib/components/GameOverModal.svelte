<script lang="ts">
	import { gameState, gameData } from '$lib/stores/gameState.svelte';
	import { MAX_GUESSES, BLANK_GUESS } from '$lib/constants';
	let { solution, targetAlpha } = $props<{
		solution: string;
		targetAlpha: string;
	}>();
	let copied = $state(false);
	function generateEmojiGrid() {
		return gameState.guesses
			.map((guess) => {
				if (guess === BLANK_GUESS) return Array(targetAlpha.length).fill('⬛').join('');
				return guess
					.split('')
					.map((char, i) => {
						if (char === targetAlpha[i]) return '🟩';
						if (targetAlpha.includes(char)) return '🟨';
						return '⬛';
					})
					.join('');
			})
			.join('\n');
	}

	async function shareResults() {
		const score = gameState.status === 'won' ? gameState.guesses.length : 'X';
		const text = `Scapedle - An OSRS Guessing Game\nTodays Word #${gameData.wordNumber} - ${score}/${MAX_GUESSES}\n\n${generateEmojiGrid()}\n\nPlay at: https://scapedle.com/`;
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'ScapeDle an OSRS Inspired Wordle Game',
					text: text
				});
				return;
			} catch (err) {
				if ((err as Error).name === 'AbortError') return;
				console.error('Share failed, falling back to clipboard', err);
			}
		}
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Clipboard failed', err);
			alert('Copy failed. Please try again or use a modern browser.');
		}
	}
</script>

{#if gameState.status !== 'playing'}
	<div
		class="my-4 flex w-full max-w-md flex-col items-center gap-4 rounded-lg border-2 border-osrs-yellow bg-zinc-900 p-6 text-center shadow-xl"
	>
		<h2 class="text-2xl tracking-tighter text-white uppercase">
			{gameState.status === 'won' ? '📜 Quest Completed 📜' : '💀 Back to Lumby 💀'}
		</h2>
		<p class="text-zinc-400">
			Word: <span class="font-mono font-bold tracking-widest text-white"
				>{solution.toUpperCase()}</span
			>
		</p>
		<button
			onclick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				shareResults();
			}}
			class="w-full rounded {copied
				? 'bg-zinc-500'
				: 'bg-green-600'} py-3 font-bold text-white transition-all active:scale-95"
		>
			{copied ? '✅ COPIED' : 'SHARE RESULTS'}
		</button>
	</div>
{/if}
