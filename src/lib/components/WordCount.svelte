<script lang="ts">
	let { wordCount } = $props<{ wordCount: number }>();
	const message: string = `${wordCount} words you can guess!`;
	const characters = message.split('');
</script>

<div class="flex w-full items-center justify-center text-center">
	<span class="text-lg text-osrs-blue">
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
