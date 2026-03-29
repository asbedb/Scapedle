<script lang="ts">
	let { data } = $props();
	const solution = $derived(data.xgha.itemName.toUpperCase());
	const emojiHint = $derived(data.xgha.emojiHint);
	const wordHint = $derived(data.xgha.wordHint);
	import SiteTitle from '$lib/components/SiteTitle.svelte';
	import WordMatch from '$lib/components/WordMatch.svelte';
	const dateTime = new Date();
	const day = dateTime.getDate();
	const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
	const year = dateTime.getFullYear();
</script>

<div class="flex h-full w-full justify-center rounded-xl p-4">
	<div class="flex h-full w-full flex-col items-center gap-4 rounded-xl bg-osrs-background">
		<SiteTitle />
		<span class="text-xl text-osrs-yellow">{day}/{month}/{year}</span>
		<span class="text-3xl">Emoji Hint: {emojiHint}</span>
		<WordMatch word={solution} extraHint={wordHint} />
	</div>
</div>
