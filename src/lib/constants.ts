export const MAX_GUESSES = 5;
export const BLANK_GUESS = '_BLANK_';
export const STORAGE_KEY = 'scapdle';

export const APOSTROPHE_RE = /'/g;
export const NON_ALPHA_RE = /[^a-zA-Z]/g;
export const WHITESPACE_RE = /\s+/;
export const NON_UPPER_RE = /[^A-Z]/g;
export const ALPHA_RE = /[a-zA-Z]/;
export const UPPER_RE = /[A-Z]/;

export const isSpecial = (char: string) => !ALPHA_RE.test(char);
