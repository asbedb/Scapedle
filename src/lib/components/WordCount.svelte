<script lang="ts">
	import { onMount } from 'svelte';
	import { MOTDS } from '$lib/constants';
	let { wordCount } = $props<{ wordCount: number }>();
	let tagline = $state(MOTDS[0]);
	onMount(() => {
		tagline = MOTDS[Math.floor(Math.random() * MOTDS.length)];
	});

	const message = $derived(`${wordCount} words - ${tagline}`);
	const characters = $derived(message.split(''));
</script>

<div class="flex w-full items-center justify-center text-center">
	<span class="text-lg text-osrs-yellow">
		{#each characters as char, i (i)}
			<span class="wavy" style="animation-delay: {i * 0.1}s">
				{char === ' ' ? '\u00A0' : char}
			</span>
		{/each}
	</span>
</div>

<style>
	.wavy {
		position: relative;
		display: inline-block;
		animation: wavy 1s ease infinite;
	}

	@keyframes wavy {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}
</style>
