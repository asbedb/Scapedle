<script lang="ts">
	let { data } = $props();
	const solution = $derived(data.itemName);
	const emojiHint = $derived(data.emojiHint);
	const wordHint = $derived(data.wordHint);
	const wordNumber = $derived(data.wordNumber);
	import SiteTitle from '$lib/components/SiteTitle.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import WordMatch from '$lib/components/WordMatch.svelte';
</script>

<div class="flex h-full w-full justify-center rounded-xl p-4">
	<div class="flex h-full w-full flex-col items-center gap-4 rounded-xl bg-osrs-background">
		<SiteTitle />
		<Timer />
		<span class="text-3xl">Emoji Hint: {emojiHint}</span>
		<span class="text-xl text-osrs-yellow">Word #{wordNumber}</span>
		<WordMatch word={solution} extraHint={wordHint} {wordNumber} />
	</div>
</div>
