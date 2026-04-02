<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity'; // 1. Import the Rune-friendly Date
	let timeLeft = $state('00:00:00');
	function updateCountdown() {
		const now = new SvelteDate();
		let target = new SvelteDate(
			Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 13, 0, 0)
		);

		if (now.getTime() >= target.getTime()) {
			target.setUTCDate(target.getUTCDate() + 1);
		}

		const diff = target.getTime() - now.getTime();

		const h = Math.floor(diff / (1000 * 60 * 60));
		const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const s = Math.floor((diff % (1000 * 60)) / 1000);

		timeLeft = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	}
	onMount(() => {
		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	});
</script>

<div class="flex items-center gap-1 font-osrs-small text-xs">
	<span class="tracking-widest">Next quest in:</span>
	<span class="font-bold text-osrs-yellow tabular-nums">
		{timeLeft}
	</span>
</div>
