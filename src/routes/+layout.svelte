<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/icons/spell-book.png';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Scapedle - A RuneScape guessing game.</title>
	<meta
		name="description"
		content="Scapedle is an OSRS based guessing game similar to wordle with a daily word."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://scapedle.com/" />
	<meta property="og:title" content="Scapedle - A RuneScape guessing game." />
	<meta
		property="og:description"
		content="Scapedle is an OSRS based guessing game similar to wordle with a daily word."
	/>
	<meta property="og:image" content="https://scapedle.com/social-banner.png" />
	<link rel="canonical" href="https://scapedle.com/" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Scapedle - A RuneScape guessing game." />
	<meta
		name="twitter:description"
		content="Scapedle is an OSRS based guessing game similar to wordle with a daily word."
	/>
	<meta name="twitter:image" content="https://scapedle.com/social-banner.png" />
</svelte:head>
<div class="flex min-h-svh min-w-svw bg-osrs-black font-osrs text-white">
	{@render children()}
</div>
