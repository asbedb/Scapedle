<script lang="ts">
	import spellBook from '$lib/assets/icons/spell-book.png';
	import RoundedFrame from './RoundedFrame.svelte';
</script>

<div class=" flex w-full flex-col items-center justify-center bg-osrs-dark-brown p-8">
	<div class="flex items-center gap-4">
		<RoundedFrame>
			<img
				src={spellBook}
				alt="site icon"
				class="pixel-art h-full w-full object-contain pb-1"
				width="50"
				height="50"
			/>
		</RoundedFrame>
		<h1 class="text-6xl">Scapedle</h1>
	</div>
	<div class="font-osrs-small text-lg text-osrs-red">A osrs based wordle</div>
</div>
