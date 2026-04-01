<script lang="ts">
	import { gameData, gameState } from '$lib/stores/gameState.svelte';
	import { BLANK_GUESS } from '$lib/constants';
	let { focusInput } = $props<{
		focusInput: () => void;
	}>();
	function useHint() {
		if (gameState.status !== 'playing' || gameState.hintUsed || !gameData.wordHint) return;
		gameState.guesses.push(BLANK_GUESS);
		gameState.hintUsed = true;
		focusInput();
	}
</script>

{#if gameData.wordHint}
	<div class="flex flex-col items-center gap-2">
		{#if !gameState.hintUsed}
			<button
				onclick={(e) => {
					e.stopPropagation();
					useHint();
				}}
				class="rounded-full border border-osrs-red bg-osrs-panel px-6 py-2 text-xs font-bold text-osrs-green transition-all hover:text-osrs-red active:scale-95"
			>
				PROMPT HINT (-1 GUESS)
			</button>
		{:else}
			<div class="rounded border border-osrs-gold bg-osrs-panel px-6 py-3 text-center">
				<p class="text-[10px] tracking-widest text-osrs-yellow uppercase">Hint Revealed</p>
				<p class="text-lg font-bold uppercase">{gameData.wordHint}</p>
			</div>
		{/if}
	</div>
{/if}
