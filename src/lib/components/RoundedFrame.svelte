<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div
	class="flex h-22 w-22 shrink-0 items-center justify-center overflow-hidden rounded-full bg-osrs-dark-brown p-2"
>
	{@render children()}
</div>
