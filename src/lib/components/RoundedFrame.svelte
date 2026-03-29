<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div class="rounded-ful flex h-22 w-22 shrink-0 items-center justify-center overflow-hidden p-2">
	{@render children()}
</div>
