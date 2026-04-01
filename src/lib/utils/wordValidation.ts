// Target: "IRON DAGGER" → targetParts: ["IRON", "DAGGER"]
// Guess: "IRONDAGGER" (10 chars)
// Validates "IRON" (4 chars) and "DAGGER" (6 chars) separately

export function validateGuess(
	guess: string,
	targetParts: string[],
	dictionary?: Record<number, string[]>
): boolean {
	if (!dictionary) return true;
	let currentIndex = 0;
	for (const part of targetParts) {
		const cleanPart = part.replace(/[^A-Z]/g, '');
		const partLength = cleanPart.length;
		const guessChunk = guess.slice(currentIndex, currentIndex + partLength);
		const validWordsForLength = dictionary[partLength] || [];
		if (!validWordsForLength.includes(guessChunk)) {
			return false;
		}
		currentIndex += partLength;
	}
	return true;
}
