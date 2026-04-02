<script lang="ts">
	let { data } = $props();
	import { initStore, gameData, type ExternalData } from '$lib/stores/gameState.svelte';
	import EmojiHint from '$lib/components/EmojiHint.svelte';
	import SiteTitle from '$lib/components/SiteTitle.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import WordNumber from '$lib/components/WordNumber.svelte';
	import GameBoard from '$lib/components/GameBoard.svelte';
	import WordCount from '$lib/components/WordCount.svelte';
	import DiscordEmbed from '$lib/components/DiscordEmbed.svelte';
	initStore(data as ExternalData);
</script>

<div class="flex h-full w-full justify-center rounded-xl p-4">
	<div class="flex h-full w-full flex-col items-center gap-4 rounded-xl bg-osrs-background">
		<SiteTitle />
		<Timer />
		<WordCount wordCount={data.wordCount} />
		<EmojiHint emojiHint={gameData.emojiHint} />
		<WordNumber wordNumber={gameData.wordNumber} />
		<GameBoard />
		<DiscordEmbed />
	</div>
</div>
