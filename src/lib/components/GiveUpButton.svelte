<script lang="ts">
	import { gameState } from '$lib/stores/gameState.svelte';
	import { BLANK_GUESS, MAX_GUESSES } from '$lib/constants';
	let { focusInput } = $props<{
		focusInput: () => void;
	}>();
	function giveUp() {
		if (gameState.status !== 'playing') return;
		const remaningGuesses: number = MAX_GUESSES - gameState.guesses.length;
		for (let _ = 0; _ < remaningGuesses; _++) gameState.guesses.push(BLANK_GUESS);
		focusInput();
	}
</script>

<div class="flex flex-col items-center gap-2">
	{#if gameState.status == 'playing'}
		<button
			onclick={(e) => {
				e.stopPropagation();
				giveUp();
			}}
			class="rounded-full border bg-osrs-red px-6 py-2 text-xl font-extrabold text-white transition-all hover:text-osrs-yellow active:scale-95"
		>
			Give Up
		</button>
	{:else}
		<div></div>
	{/if}
</div>
