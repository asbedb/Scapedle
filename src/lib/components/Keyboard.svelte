<script lang="ts">
	let { onKey, keyStates } = $props<{
		onKey: (key: string) => void;
		keyStates: Record<string, string>;
	}>();

	const rows = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
	];
</script>

<div
	class="mt-4 flex w-full max-w-125 flex-col items-center gap-1.5 px-1"
	style="touch-action: manipulation;"
>
	{#each rows as row, i (i)}
		<div class="flex w-full justify-center gap-1 sm:gap-1.5">
			{#each row as key (key)}
				{@const colorClass = keyStates[key] || 'bg-zinc-600'}
				<button
					onclick={(e) => {
						e.stopPropagation();
						onKey(key);
					}}
					type="button"
					class="flex h-14 items-center justify-center rounded font-bold uppercase transition-all select-none
                           {key === 'ENTER' || key === 'BACK'
						? 'flex-[1.5] text-[10px] sm:text-xs'
						: 'flex-1 text-lg'} 
                           {colorClass} hover:brightness-110 active:scale-95"
				>
					{key === 'BACK' ? '⌫' : key}
				</button>
			{/each}
		</div>
	{/each}
</div>
