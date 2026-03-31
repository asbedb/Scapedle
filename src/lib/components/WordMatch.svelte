<script lang="ts">
	import { onMount } from 'svelte';
	import Keyboard from './Keyboard.svelte';
	let {
		word: encodedWord,
		wordHint,
		wordNumber = '',
		dictionary
	} = $props<{
		word: string;
		wordHint?: string;
		wordNumber?: number;
		dictionary?: Record<number, string[]>;
	}>();
	const word = $derived(atob(encodedWord));
	const targetParts = $derived(word.toUpperCase().split(/\s+/));
	const totalExpectedLength = $derived(targetParts.join('').length);
	// State
	let guesses = $state<string[]>([]);
	let currentGuess = $state('');
	let gameStatus = $state<'playing' | 'won' | 'lost'>('playing');
	let hintUsed = $state(false);
	let copied = $state(false);
	let inputElement = $state<HTMLInputElement>();
	let gameStarted = $state(false);
	let invalidWord = $state(false);

	// Constants
	const MAX_GUESSES = 5;
	const BLANK_GUESS = '_BLANK_';
	const isSpecial = (char: string) => !/[a-zA-Z]/.test(char);
	const STORAGE_KEY = 'scapdle';

	// Derived Values
	const targetAlpha = $derived(word.replace(/[^a-zA-Z]/g, '').toUpperCase());
	const rows = $derived(Array.from({ length: MAX_GUESSES }, (_, i) => i));
	const cols = $derived(Array.from({ length: word.length }, (_, i) => i));
	let charStatuses = $derived.by(() => {
		const statuses: Record<string, string> = {};
		const targetAlphaCounts = getCounts(targetAlpha);
		guesses.forEach((guess) => {
			if (guess === BLANK_GUESS) return;

			// TRACKER: How many of each letter have we "used up" for this specific guess
			const usedCounts: Record<string, number> = {};

			// PASS 1: Identify all GREENS first (Exact matches take priority)
			for (let i = 0; i < guess.length; i++) {
				const char = guess[i];
				if (char === targetAlpha[i]) {
					statuses[char] = 'bg-green-600 border-green-600';
					usedCounts[char] = (usedCounts[char] || 0) + 1;
				}
			}

			// PASS 2: Identify YELLOWS (Oranges) and GREYS
			for (let i = 0; i < guess.length; i++) {
				const char = guess[i];
				// Skip if we already marked this specific slot as Green
				if (char === targetAlpha[i]) continue;

				if (targetAlpha.includes(char)) {
					const totalInTarget = targetAlphaCounts[char] || 0;
					const usedSoFar = usedCounts[char] || 0;

					if (usedSoFar < totalInTarget) {
						// Only upgrade to yellow if it isn't already green from a previous guess
						if (statuses[char] !== 'bg-green-600 border-green-600') {
							statuses[char] = 'bg-yellow-600 border-yellow-600';
						}
						usedCounts[char] = usedSoFar + 1;
					} else {
						// We've matched the max count; if no status exists yet, mark as grey
						if (!statuses[char]) {
							statuses[char] = 'bg-zinc-800 border-zinc-800 opacity-40';
						}
					}
				} else {
					// Not in the word at all
					if (!statuses[char]) {
						statuses[char] = 'bg-zinc-800 border-zinc-800 opacity-40';
					}
				}
			}
		});

		return statuses;
	});

	// Mounts and Effects
	onMount(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			const data = JSON.parse(saved);
			if (data.wordNumber === wordNumber) {
				guesses = data.guesses || [];
				hintUsed = data.hintUsed || false;
				gameStarted = data.gameStarted || false;
			} else {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	});
	$effect(() => {
		if (gameStarted || guesses.length > 0) {
			const stateToSave = {
				wordNumber,
				guesses: $state.snapshot(guesses),
				hintUsed,
				gameStarted
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
		}
	});
	$effect(() => {
		if (guesses.includes(targetAlpha)) {
			gameStatus = 'won';
		} else if (guesses.length >= MAX_GUESSES) {
			gameStatus = 'lost';
		} else {
			gameStatus = 'playing';
		}
	});

	function startGame() {
		gameStarted = true;
		// This timeout ensures the DOM is ready before focusing
		setTimeout(focusInput, 50);
	}

	function focusInput() {
		if (gameStatus === 'playing' && gameStarted) {
			inputElement?.focus();
		}
	}

	function handleInput(key: string) {
		if (gameStatus !== 'playing') return;
		if (key === 'BACK') {
			invalidWord = false;
			currentGuess = currentGuess.slice(0, -1);
		} else if (key === 'ENTER') {
			if (currentGuess.length === totalExpectedLength) {
				let currentIndex: number = 0;
				let isEntireGuessValid: boolean = true;
				for (const part of targetParts) {
					const partLength = part.length;
					const guessChunk = currentGuess.slice(currentIndex, currentIndex + partLength);
					const validWordsForLen = dictionary[partLength] || [];
					if (!validWordsForLen.includes(guessChunk)) {
						isEntireGuessValid = false;
						break;
					}
					currentIndex += partLength;
				}
				if (!isEntireGuessValid) {
					triggerInvalidEffect();
					return;
				}
				guesses.push(currentGuess);
				currentGuess = '';
				invalidWord = false;
			}
		} else if (currentGuess.length < totalExpectedLength && key.length === 1) {
			if (/[a-zA-Z]/.test(key)) {
				currentGuess += key.toUpperCase();
			}
		}
	}

	function handleInputEvent(e: Event) {
		const target = e.target as HTMLInputElement;
		const val = target.value.toUpperCase();
		if (val.length > 0) {
			const char = val[val.length - 1];
			if (/[A-Z]/.test(char)) handleInput(char);
		}
		target.value = '';
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.ctrlKey || e.metaKey) return;
		if (e.key === 'Enter') {
			e.preventDefault();
			handleInput('ENTER');
		} else if (e.key === 'Backspace') {
			handleInput('BACK');
		} else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
			if (document.activeElement !== inputElement) {
				handleInput(e.key.toUpperCase());
			}
		}
	}

	function useHint() {
		if (gameStatus !== 'playing' || hintUsed || !wordHint) return;
		guesses.push(BLANK_GUESS);
		hintUsed = true;
		focusInput();
	}

	function getLetterAt(rowIndex: number, colIndex: number) {
		const charInWord = word[colIndex];
		if (isSpecial(charInWord)) return charInWord;
		const alphaIndex = word.slice(0, colIndex).replace(/[^a-zA-Z]/g, '').length;
		const guessAtRow = guesses[rowIndex];
		if (guessAtRow === BLANK_GUESS) return '';
		if (rowIndex < guesses.length) return guessAtRow[alphaIndex];
		if (rowIndex === guesses.length) return currentGuess[alphaIndex];
		return '';
	}
	function getBoxStatus(guess: string, colIndex: number) {
		if (guess === BLANK_GUESS) return 'bg-zinc-800 border-zinc-900 opacity-40';
		const charInWord = word[colIndex];
		if (isSpecial(charInWord)) return 'border-none text-zinc-500';
		const alphaIndex = word.slice(0, colIndex).replace(/[^a-zA-Z]/g, '').length;
		const char = guess[alphaIndex];
		const targetChar = targetAlpha[alphaIndex];
		if (char === targetChar) return 'bg-green-600 border-green-600 text-white';
		if (!targetAlpha.includes(char)) return 'bg-zinc-700 border-zinc-700 text-zinc-400';
		const totalOccurrences = targetAlpha.split('').filter((c) => c === char).length;
		const greensInGuess = guess
			.split('')
			.filter((c, i) => c === char && targetAlpha[i] === char).length;
		const precedingYellows = guess
			.slice(0, alphaIndex)
			.split('')
			.filter((c, i) => c === char && targetAlpha[i] !== char).length;
		if (greensInGuess + precedingYellows < totalOccurrences) {
			return 'bg-yellow-600 border-yellow-600 text-white';
		}
		return 'bg-zinc-700 border-zinc-700 text-zinc-400';
	}
	const getCounts = (str: string) => {
		const counts: Record<string, number> = {};
		for (const char of str) {
			counts[char] = (counts[char] || 0) + 1;
		}
		return counts;
	};

	function generateEmojiGrid() {
		return guesses
			.map((guess) => {
				if (guess === BLANK_GUESS) return Array(targetAlpha.length).fill('⬛').join('');
				return guess
					.split('')
					.map((char, i) => {
						if (char === targetAlpha[i]) return '🟩';
						if (targetAlpha.includes(char)) return '🟨';
						return '⬛';
					})
					.join('');
			})
			.join('\n');
	}

	async function shareResults() {
		const score = gameStatus === 'won' ? guesses.length : 'X';
		const text = `Scapedle\nAn OSRS Inspired Wordle ${score}/${MAX_GUESSES}\n\nWord #${wordNumber}\n\n${generateEmojiGrid()}\n\nPlay at: scapedle.com`;
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'ScapeDle an OSRS Inspired Wordle Game',
					text: text
				});
				return;
			} catch (err) {
				if ((err as Error).name === 'AbortError') return;
				console.error('Share failed, falling back to clipboard', err);
			}
		}
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Clipboard failed', err);
			alert('Copy failed. Please try again or use a modern browser.');
		}
	}

	function triggerInvalidEffect() {
		invalidWord = true;
		setTimeout(() => {
			invalidWord = false;
		}, 1500);
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<main
	role="presentation"
	class="relative flex min-h-screen w-full flex-col items-center gap-4 overflow-x-hidden bg-zinc-950 px-4 py-8 text-white select-none"
	onclick={focusInput}
	aria-label="OSRS Game Surface"
	style="touch-action: manipulation;"
>
	<div class="mb-4 flex w-full flex-col gap-2 px-2">
		{#if invalidWord}
			<span
				class="flex w-full animate-pulse items-center justify-center text-center font-osrs-small text-sm font-bold text-osrs-red uppercase"
			>
				Not in word list
			</span>
		{/if}
		{#each rows as r (r)}
			<div
				class="flex justify-center gap-1 sm:gap-2 {r === guesses.length && invalidWord
					? 'animate-pulse'
					: ''}"
			>
				{#each cols as c (c)}
					{@const letter = getLetterAt(r, c)}
					{@const isCharSpecial = isSpecial(word[c])}
					{@const isSubmitted = r < guesses.length}
					{@const isCurrent = r === guesses.length}

					<div
						class="flex aspect-square w-full max-w-12 items-center justify-center border-2 text-lg font-bold uppercase transition-all duration-500 sm:h-12 sm:w-12 sm:text-2xl
                    {isSubmitted && !isCharSpecial ? getBoxStatus(guesses[r], c) : ''}
                    {isCurrent && !isCharSpecial ? 'border-zinc-400 bg-zinc-800/50' : ''}
                    {!isSubmitted && !isCurrent && !isCharSpecial ? 'border-zinc-600' : ''}
                    {isCharSpecial ? 'border-none text-zinc-500' : ''}"
					>
						{letter || ''}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	{#if gameStatus !== 'playing'}
		<div
			class="my-4 flex w-full max-w-md flex-col items-center gap-4 rounded-lg border-2 border-osrs-yellow bg-zinc-900 p-6 text-center shadow-xl"
		>
			<h2 class="text-2xl tracking-tighter text-white uppercase">
				{gameStatus === 'won' ? '📜 Quest Completed 📜' : '💀 Back to Lumby 💀'}
			</h2>
			<p class="text-zinc-400">
				Word: <span class="font-mono font-bold tracking-widest text-white"
					>{word.toUpperCase()}</span
				>
			</p>
			<button
				onclick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					shareResults();
				}}
				class="w-full rounded {copied
					? 'bg-zinc-500'
					: 'bg-green-600'} py-3 font-bold text-white transition-all active:scale-95"
			>
				{copied ? '✅ COPIED' : 'SHARE RESULTS'}
			</button>
		</div>
	{/if}

	<div class="flex w-full max-w-md flex-col items-center gap-6">
		<div class="w-full {gameStatus !== 'playing' ? 'pointer-events-none opacity-50' : ''}">
			<Keyboard onKey={handleInput} keyStates={charStatuses} />
		</div>

		{#if wordHint}
			<div class="flex flex-col items-center gap-2">
				{#if !hintUsed}
					<button
						onclick={(e) => {
							e.stopPropagation();
							useHint();
						}}
						class="rounded-full border border-osrs-red bg-osrs-panel px-6 py-2 text-xs font-bold text-osrs-green transition-all hover:text-osrs-red active:scale-95"
					>
						PROMPT HINT (-1 GUESS)
					</button>
				{:else}
					<div class="rounded border border-osrs-gold bg-osrs-panel px-6 py-3 text-center">
						<p class="text-[10px] tracking-widest text-osrs-yellow uppercase">Hint Revealed</p>
						<p class="text-lg font-bold uppercase">{wordHint}</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<input
		bind:this={inputElement}
		type="text"
		class="absolute top-0 left-0 -z-50 h-0 w-0 opacity-0"
		oninput={handleInputEvent}
		autocapitalize="characters"
		autocomplete="off"
		autocorrect="off"
		inputmode="text"
		aria-hidden="true"
	/>

	{#if !gameStarted}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm"
		>
			<button
				onclick={startGame}
				class="rounded-lg border-2 border-osrs-gold bg-osrs-panel px-8 py-4 text-xl font-bold text-osrs-yellow shadow-2xl transition-transform hover:scale-105 active:scale-95"
			>
				Start Quest
			</button>
		</div>
	{/if}
</main>

<style>
	:global(body) {
		-webkit-tap-highlight-color: transparent;
		background-color: #09090b;
	}
</style>
