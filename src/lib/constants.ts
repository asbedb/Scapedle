export const MAX_GUESSES = 5;
export const BLANK_GUESS = '_BLANK_';
export const STORAGE_KEY = 'scapdle';

export const isSpecial = (char: string) => !/[a-zA-Z]/.test(char);
