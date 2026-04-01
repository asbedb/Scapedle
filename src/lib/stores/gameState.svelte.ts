export interface ExternalData {
	itemName: string;
	emojiHint: string;
	wordHint: string;
	wordNumber: number;
	dictionary: Record<number, string[]>;
}

export interface GameStateType {
	guesses: string[];
	currentGuess: string;
	status: 'playing' | 'won' | 'lost';
	hintUsed: boolean;
	gameStarted: boolean;
	invalidWord: boolean;
}

let rawData = $state<ExternalData>({
	itemName: '',
	emojiHint: '',
	wordHint: '',
	wordNumber: 0,
	dictionary: {}
});

export const solution = {
	get value() {
		return rawData.itemName;
	}
};

export const gameData = {
	get solution() {
		return rawData.itemName;
	},
	get emojiHint() {
		return rawData.emojiHint;
	},
	get wordHint() {
		return rawData.wordHint;
	},
	get wordNumber() {
		return rawData.wordNumber;
	},
	get dictionary() {
		return rawData.dictionary;
	}
};

export const gameState = $state<GameStateType>({
	guesses: [],
	currentGuess: '',
	status: 'playing',
	hintUsed: false,
	gameStarted: false,
	invalidWord: false
});

export function initStore(data: ExternalData) {
	const isNewWord = data.wordNumber !== rawData.wordNumber;
	if (isNewWord) {
		gameState.guesses = [];
		gameState.status = 'playing';
		gameState.gameStarted = false;
		gameState.hintUsed = false;
	}
	rawData = data;
}
