<script lang="ts">
	import spellBook from '$lib/assets/icons/spell-book.png';
	import RoundedFrame from './RoundedFrame.svelte';
</script>

<div
	class=" flex w-full items-center justify-center gap-4 bg-osrs-dark-brown p-8 text-center text-7xl"
>
	<RoundedFrame>
		<img
			src={spellBook}
			alt="Roast Chicken Icon"
			class="pixel-art h-full w-full object-contain pb-1"
			width="50"
			height="50"
		/>
	</RoundedFrame>
	<h1 class="">Runedle</h1>
</div>
