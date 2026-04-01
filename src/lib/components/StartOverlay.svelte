<script lang="ts">
	let { onStart } = $props<{
		onStart: () => void;
	}>();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm">
	<button
		onclick={onStart}
		class="rounded-lg border-2 border-osrs-gold bg-osrs-panel px-8 py-4 text-xl font-bold text-osrs-yellow shadow-2xl transition-transform hover:scale-105 active:scale-95"
	>
		Start Quest
	</button>
</div>
