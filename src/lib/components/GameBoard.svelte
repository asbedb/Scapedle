<script lang="ts">
	import { onMount } from 'svelte';
	import { STORAGE_KEY, MAX_GUESSES } from '$lib/constants';
	import { gameState, gameData } from '$lib/stores/gameState.svelte';
	import GameOverModal from './GameOverModal.svelte';
	import GameRows from './GameRows.svelte';
	import HintButton from './HintButton.svelte';
	import InvalidWordAlert from './InvalidWordAlert.svelte';
	import Keyboard from './Keyboard.svelte';
	import StartOverlay from './StartOverlay.svelte';
	let inputElement = $state<HTMLInputElement>();
	const solution = $derived(atob(gameData.solution).replace(/'/g, ''));
	const targetAlpha = $derived(solution.replace(/[^a-zA-Z]/g, '').toUpperCase());
	const targetParts = $derived(solution.toUpperCase().split(/\s+/));
	const totalExpectedLength = $derived(targetParts.join('').length);

	function focusInput() {
		if (gameState.status === 'playing' && gameState.gameStarted) {
			inputElement?.focus();
		}
	}
	function handleInput(key: string) {
		if (gameState.status !== 'playing') return;
		if (key === 'BACK') {
			gameState.invalidWord = false;
			gameState.currentGuess = gameState.currentGuess.slice(0, -1);
		} else if (key === 'ENTER') {
			if (gameState.currentGuess.length === totalExpectedLength) {
				let isEntireGuessValid = true;
				let currentIndex: number = 0;
				for (const part of targetParts) {
					const cleanPart = part.replace(/[^A-Z]/g, '');
					const partLength = cleanPart.length;
					const guessChunk = gameState.currentGuess.slice(currentIndex, currentIndex + partLength);
					const validWordsForLen = gameData.dictionary[partLength] || [];
					if (!validWordsForLen.includes(guessChunk)) {
						isEntireGuessValid = false;
						triggerInvalidEffect();
						break;
					}
					currentIndex += partLength;
				}
				if (isEntireGuessValid) {
					gameState.guesses.push(gameState.currentGuess);
					gameState.currentGuess = '';
					gameState.invalidWord = false;
				}
			}
		} else if (gameState.currentGuess.length < totalExpectedLength && key.length === 1) {
			if (/[a-zA-Z]/.test(key)) {
				gameState.currentGuess += key.toUpperCase();
			}
		}
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
	function handleInputEvent(e: Event) {
		const target = e.target as HTMLInputElement;
		const val = target.value.toUpperCase();
		if (val.length > 0) {
			const char = val[val.length - 1];
			if (/[A-Z]/.test(char)) handleInput(char);
		}
		target.value = '';
	}
	function triggerInvalidEffect() {
		gameState.invalidWord = true;
		setTimeout(() => {
			gameState.invalidWord = false;
		}, 1500);
	}
	function startGame() {
		gameState.gameStarted = true;
		setTimeout(focusInput, 50);
	}
	onMount(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			const data = JSON.parse(saved);
			if (data.wordNumber === gameData.wordNumber) {
				gameState.guesses = data.guesses || [];
				gameState.hintUsed = data.hintUsed || false;
				gameState.gameStarted = data.gameStarted || false;
			} else {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	});
	$effect(() => {
		if (gameState.gameStarted || gameState.guesses.length > 0) {
			const stateToSave = {
				wordNumber: gameData.wordNumber,
				guesses: $state.snapshot(gameState.guesses),
				hintUsed: gameState.hintUsed,
				gameStarted: gameState.gameStarted
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
		}
	});
	$effect(() => {
		if (gameState.guesses.includes(targetAlpha)) {
			gameState.status = 'won';
		} else if (gameState.guesses.length >= MAX_GUESSES) {
			gameState.status = 'lost';
		} else {
			gameState.status = 'playing';
		}
	});
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
		<InvalidWordAlert />
		<GameRows {solution} {targetAlpha} />
	</div>
	<GameOverModal {solution} {targetAlpha} />
	<div class="flex w-full max-w-md flex-col items-center gap-6">
		<div class="w-full {gameState.status !== 'playing' ? 'pointer-events-none opacity-50' : ''}">
			<Keyboard onKey={handleInput} {targetAlpha} />
		</div>
		<HintButton {focusInput} />
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
	<StartOverlay {startGame} />
</main>

<style>
	:global(body) {
		-webkit-tap-highlight-color: transparent;
		background-color: #09090b;
	}
</style>
