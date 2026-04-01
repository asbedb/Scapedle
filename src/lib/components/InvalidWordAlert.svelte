<script lang="ts">
	import { gameState } from '$lib/stores/gameState.svelte';
</script>

{#if gameState.invalidWord}
	<span
		class="flex w-full animate-pulse items-center justify-center text-center font-osrs-small text-sm font-bold text-osrs-red uppercase"
	>
		Not in word list
	</span>
{/if}
